import { API_URL } from "@/lib/constants";
import { ApiErrorResponse } from "@/types/common.types";

// ── Error tipado ──────────────────────────────────────────────────

export class ApiError extends Error {
  readonly statusCode: number;
  readonly details: string | string[];

  constructor(statusCode: number, message: string | string[]) {
    super(Array.isArray(message) ? message.join(", ") : message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = message;
  }

  get isNotFound(): boolean {
    return this.statusCode === 404;
  }

  get isNetworkError(): boolean {
    return this.statusCode === 0;
  }
}

// ── Serialización de query params ─────────────────────────────────
// Maneja arrays como parámetros repetidos:
// { formats: ['TV', 'OVA'] } → "formats=TV&formats=OVA"

export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      for (const item of value as unknown[]) {
        if (item !== undefined && item !== null) {
          searchParams.append(key, String(item));
        }
      }
    } else {
      searchParams.set(key, String(value));
    }
  }

  const result = searchParams.toString();
  return result ? `?${result}` : "";
}

// ── Fetch con manejo de errores ───────────────────────────────────

export async function fetchApi<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_URL}${path}`;

  let response: Response;

  try {
    response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new ApiError(0, "Error de red: no se pudo conectar con el servidor");
  }

  if (!response.ok) {
    // Intenta leer el body de error de NestJS
    let message: string | string[] =
      `Error ${response.status}: ${response.statusText}`;

    try {
      const errorData = (await response.json()) as Partial<ApiErrorResponse>;
      if (errorData.message) {
        message = errorData.message;
      }
    } catch {
      // Si el body no es JSON válido, usamos el mensaje por defecto
    }

    throw new ApiError(response.status, message);
  }

  return response.json() as Promise<T>;
}
