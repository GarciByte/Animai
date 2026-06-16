import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

// ── Tipos de la respuesta cruda de AniList ──────────────────────
interface AnilistError {
  message: string;
  status: number;
  locations?: { line: number; column: number }[];
}

interface AnilistResponse<T> {
  data: T;
  errors?: AnilistError[];
}

@Injectable()
export class AnilistClient {
  private readonly http: AxiosInstance;

  constructor(private readonly config: ConfigService) {
    this.http = axios.create({
      baseURL: this.config.get<string>('anilist.apiUrl'),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async query<T>(graphqlQuery: string, variables?: object): Promise<T> {
    const response = await this.http.post<AnilistResponse<T>>('', {
      query: graphqlQuery,
      variables,
    });

    const { data, errors } = response.data;

    if (errors && errors.length > 0) {
      const message = errors.map((e) => e.message).join(', ');
      throw new InternalServerErrorException(`AniList error: ${message}`);
    }

    return data;
  }
}
