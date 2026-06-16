import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosError } from 'axios';

// ── Tipos de la respuesta de error de TMDB ──────────────────────
interface TmdbError {
  success: false;
  status_code: number;
  status_message: string;
}

function isTmdbError(data: unknown): data is TmdbError {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    (data as Record<string, unknown>)['success'] === false
  );
}

@Injectable()
export class TmdbClient {
  private readonly http: AxiosInstance;

  constructor(private readonly config: ConfigService) {
    this.http = axios.create({
      baseURL: this.config.get<string>('tmdb.apiUrl'),
      headers: {
        'Content-Type': 'application/json',
        // TMDB recomienda autenticación por header en lugar de query param
        Authorization: `Bearer ${this.config.get<string>('tmdb.apiKey')}`,
      },
    });
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    try {
      const response = await this.http.get<T>(path, { params });

      // TMDB a veces responde HTTP 200 pero con success: false
      if (isTmdbError(response.data)) {
        throw new InternalServerErrorException(
          `TMDB error: ${response.data.status_message}`,
        );
      }

      return response.data;
    } catch (err) {
      // Evitar re-envolver excepciones de NestJS que ya lanzamos arriba
      if (err instanceof InternalServerErrorException) {
        throw err;
      }

      // Errores HTTP 4xx/5xx reales de TMDB
      if (err instanceof AxiosError && err.response) {
        const tmdbError = err.response.data as TmdbError;
        throw new InternalServerErrorException(
          `TMDB error: ${tmdbError.status_message ?? err.message}`,
        );
      }

      // Error de red u otro error inesperado
      throw new InternalServerErrorException(
        `TMDB error inesperado: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    }
  }
}
