import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosError } from 'axios';

// ── Tipos de la respuesta cruda de Jikan ────────────────────────
interface JikanResponse<T> {
  data: T;
}

interface JikanError {
  status: number;
  type: string;
  message: string;
  error: string | null;
}

@Injectable()
export class JikanClient {
  private readonly http: AxiosInstance;

  constructor(private readonly config: ConfigService) {
    this.http = axios.create({
      baseURL: this.config.get<string>('jikan.apiUrl'),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    try {
      const response = await this.http.get<JikanResponse<T>>(path, { params });
      return response.data.data;
    } catch (err) {
      // Jikan devuelve errores como respuestas HTTP 4xx/5xx,
      // por lo que axios los lanza como AxiosError
      if (err instanceof AxiosError && err.response) {
        const jikanError = err.response.data as JikanError;
        throw new InternalServerErrorException(
          `Jikan error: ${jikanError.message ?? err.message}`,
        );
      }

      // Error de red u otro error inesperado
      throw new InternalServerErrorException(
        `Jikan error inesperado: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    }
  }
}
