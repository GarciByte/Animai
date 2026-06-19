"use client";

import { useState, useCallback, useRef } from "react";
import { animeService } from "@/services/anime.service";
import { ApiError } from "@/lib/api";
import { AnimeListItem, SearchAnimeParams } from "@/types/anime.types";

const DEFAULT_FILTERS: SearchAnimeParams = {
  quickFilter: "TRENDING",
  perPage: 20,
};

export function useAnimeSearch() {
  const [items, setItems] = useState<AnimeListItem[]>([]);
  const [filters, setFilters] = useState<SearchAnimeParams>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Captura los filtros activos en el momento de presionar "buscar".
  // loadMore usa SIEMPRE estos filtros, no los que el usuario tenga
  // pendientes en la UI, para evitar paginación inconsistente.
  const activeFiltersRef = useRef<SearchAnimeParams>(DEFAULT_FILTERS);

  // Indica si está cargando la primera página (items vacíos):
  // el componente puede mostrar skeleton en lugar de spinner.
  const isInitialLoading = isLoading && items.length === 0;

  const search = useCallback(async () => {
    // Congela los filtros actuales para que loadMore los use
    activeFiltersRef.current = { ...filters };

    setIsLoading(true);
    setError(null);
    // Limpiar la lista antes de cargar nuevos resultados
    setItems([]);
    setCurrentPage(1);
    setHasNextPage(false);

    try {
      const result = await animeService.searchAnime({
        ...activeFiltersRef.current,
        page: 1,
      });

      setItems(result.data);
      setHasNextPage(result.pageInfo.hasNextPage);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Error inesperado al cargar los animes";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const loadMore = useCallback(async () => {
    // Guardia: no cargar si ya hay una petición en curso o no hay más páginas
    if (isLoading || !hasNextPage) return;

    const nextPage = currentPage + 1;
    setIsLoading(true);

    try {
      const result = await animeService.searchAnime({
        ...activeFiltersRef.current, // filtros del search activo, no los pendientes
        page: nextPage,
      });

      setItems((prev) => [...prev, ...result.data]);
      setHasNextPage(result.pageInfo.hasNextPage);
      setCurrentPage(nextPage);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Error al cargar más animes";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, hasNextPage, isLoading]);

  // Actualiza un solo campo de los filtros de forma tipada:
  // updateFilter('sort', 'SCORE_DESC')
  const updateFilter = useCallback(
    <K extends keyof SearchAnimeParams>(
      key: K,
      value: SearchAnimeParams[K],
    ) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // Limpia un campo de filtro (lo pone a undefined)
  const clearFilter = useCallback((key: keyof SearchAnimeParams) => {
    setFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    // Estado
    items,
    filters,
    isLoading,
    isInitialLoading,
    hasNextPage,
    error,
    // Acciones
    search,
    loadMore,
    updateFilter,
    clearFilter,
    resetFilters,
  } as const;
}
