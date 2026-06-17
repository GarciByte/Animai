import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, AxiosInstance } from 'axios';

// ── Tipos de la API de OpenRouter ───────────────────────────────
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterChoice {
  message: ChatMessage;
  finish_reason: string;
}

interface OpenRouterResponse {
  id: string;
  model: string;
  choices: OpenRouterChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface OpenRouterErrorBody {
  error?: {
    message?: string;
    code?: number;
    type?: string;
  };
}

function isOpenRouterError(data: unknown): data is OpenRouterErrorBody {
  return typeof data === 'object' && data !== null && 'error' in data;
}

@Injectable()
export class OpenRouterClient {
  private readonly http: AxiosInstance;
  private readonly model: string;

  constructor(private readonly config: ConfigService) {
    this.http = axios.create({
      baseURL: this.config.get<string>('openrouter.apiUrl'),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.get<string>('openrouter.apiKey')}`,
        // Recomendado por OpenRouter para identificar la app
        'HTTP-Referer': 'https://animai-app.vercel.app',
        'X-Title': 'Animai',
      },
    });

    this.model = this.config.get<string>('openrouter.model') ?? '';
  }

  async chat(messages: ChatMessage[], systemPrompt: string): Promise<string> {
    // El system prompt siempre va primero como mensaje de rol 'system'
    const fullMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ];

    try {
      const response = await this.http.post<OpenRouterResponse>(
        '/chat/completions',
        {
          model: this.model,
          messages: fullMessages,
        },
      );

      const content = response.data.choices[0]?.message?.content;

      if (!content) {
        throw new InternalServerErrorException(
          'OpenRouter no devolvió contenido en la respuesta',
        );
      }

      return content;
    } catch (err) {
      if (err instanceof InternalServerErrorException) {
        throw err;
      }

      if (err instanceof AxiosError && err.response) {
        const errorData: unknown = err.response.data;
        const message = isOpenRouterError(errorData)
          ? (errorData.error?.message ?? `HTTP ${err.response.status}`)
          : `HTTP ${err.response.status}`;

        throw new InternalServerErrorException(`OpenRouter error: ${message}`);
      }

      throw new InternalServerErrorException(
        `OpenRouter error inesperado: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    }
  }
}
