import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, AxiosInstance } from 'axios';
import qs from 'qs';

// ── Tipos de la respuesta de error de AnimeThemes ───────────────
interface AnimeThemesError {
  message?: string;
}

function isAnimeThemesError(data: unknown): data is AnimeThemesError {
  return typeof data === 'object' && data !== null && 'message' in data;
}

@Injectable()
export class AnimeThemesClient {
  private readonly http: AxiosInstance;

  constructor(private readonly config: ConfigService) {
    this.http = axios.create({
      baseURL: this.config.get<string>('animethemes.apiUrl'),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    try {
      const query = params
        ? qs.stringify(params, { encodeValuesOnly: true })
        : '';
      const url = query ? `${path}?${query}` : path;

      const response = await this.http.get<T>(url); // sin { params }
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        const errorData: unknown = err.response.data;
        const message = isAnimeThemesError(errorData)
          ? (errorData.message ?? `HTTP ${err.response.status}`)
          : `HTTP ${err.response.status}`;
        throw new InternalServerErrorException(`AnimeThemes error: ${message}`);
      }
      throw new InternalServerErrorException(
        `AnimeThemes error inesperado: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    }
  }
}
