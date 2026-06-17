import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, AxiosInstance } from 'axios';
import Bottleneck from 'bottleneck';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';

interface JikanError {
  status: number;
  type: string;
  message: string;
  error: string | null;
}

@Injectable()
export class JikanClient {
  private readonly http: AxiosInstance;
  private readonly limiter = new Bottleneck({
    maxConcurrent: 1, // una petición a la vez
    minTime: 500, // 500ms entre peticiones
  });

  constructor(private readonly config: ConfigService) {
    this.http = axios.create({
      baseURL: this.config.get<string>('jikan.apiUrl'),
      headers: { 'Content-Type': 'application/json' },
      timeout: 15_000,
      // Cada petición abre su propia conexión TCP — evita sockets rancios
      httpAgent: new HttpAgent({ keepAlive: false }),
      httpsAgent: new HttpsAgent({ keepAlive: false }),
    });
  }

  get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.limiter.schedule(() => this.execute<T>(path, params));
  }

  private async execute<T>(
    path: string,
    params?: Record<string, unknown>,
    attempt = 1,
  ): Promise<T> {
    try {
      const response = await this.http.get<T>(path, { params });
      return response.data;
    } catch (err) {
      const isSocketError =
        err instanceof Error &&
        (err.message.includes('socket hang up') ||
          err.message.includes('ECONNRESET') ||
          err.message.includes('ETIMEDOUT'));

      // Hasta 2 reintentos en errores de red, con backoff
      // El reintento ocurre dentro del job de Bottleneck, no consume slot extra
      if (isSocketError && attempt < 3) {
        await new Promise((r) => setTimeout(r, 1000 * attempt));
        return this.execute<T>(path, params, attempt + 1);
      }

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
