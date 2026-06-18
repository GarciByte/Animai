// ── Tipos compartidos en toda la aplicación ─────────────────────────

export interface FuzzyDate {
  year: number | null;
  month: number | null;
  day: number | null;
}

export interface PageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  perPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pageInfo: PageInfo;
}

// Forma de error que devuelven las excepciones por defecto de NestJS
// (NotFoundException, InternalServerErrorException, ValidationPipe…)
export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

// Next.js 15: params y searchParams llegan como Promise en los Server
// Components. Se define aquí para tenerlo listo cuando se creen las páginas.
export type AsyncPageProps<
  P extends Record<string, string> = Record<string, string>,
> = {
  params: Promise<P>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};
