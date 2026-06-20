"use client";

import { useState, useCallback, useRef } from "react";
import { animeService } from "@/services/anime.service";
import { ApiError } from "@/lib/api";
import { AnimeListItem, SearchAnimeParams } from "@/types/anime.types";

const DEFAULT_FILTERS: SearchAnimeParams = {
  sort: "TRENDING_DESC",
  perPage: 20,
};

export function useAnimeSearch() {
  const [items, setItems] = useState<AnimeListItem[]>([]);
  const [filters, setFilters] = useState<SearchAnimeParams>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Refleja siempre el estado `filters` más reciente, de forma síncrona.
  // applyFilter/updateQuery lo usan para calcular el "next" sin
  // depender de closures que podrían estar desactualizadas.
  const filtersRef = useRef<SearchAnimeParams>(DEFAULT_FILTERS);

  // Snapshot de los filtros con los que se hizo la ÚLTIMA petición real.
  // loadMore pagina siempre sobre estos, nunca sobre texto a medio
  // escribir en el buscador de nombre que aún no se ha "buscado".
  const activeFiltersRef = useRef<SearchAnimeParams>(DEFAULT_FILTERS);

  const isInitialLoading = isLoading && items.length === 0;

  const performSearch = useCallback(async (params: SearchAnimeParams) => {
    activeFiltersRef.current = params;

    setIsLoading(true);
    setError(null);
    setItems([]);
    setCurrentPage(1);
    setHasNextPage(false);

    try {
      const result = await animeService.searchAnime({ ...params, page: 1 });
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
  }, []);

  // Carga inicial / recarga manteniendo los filtros tal cual están.
  // La usa solo el useEffect de montaje en HomeView.
  const search = useCallback(
    () => performSearch(filtersRef.current),
    [performSearch],
  );

  // Botón "Buscar" del buscador por nombre: fuerza orden por Popularidad.
  const searchByName = useCallback(() => {
    const next: SearchAnimeParams = {
      ...filtersRef.current,
      sort: "POPULARITY_DESC",
    };
    filtersRef.current = next;
    setFilters(next);
    return performSearch(next);
  }, [performSearch]);

  // Cambiar cualquier filtro (vista rápida, orden, temporada, año,
  // formato, estado, género): actualiza el estado Y busca de inmediato.
  const applyFilter = useCallback(
    <K extends keyof SearchAnimeParams>(
      key: K,
      value: SearchAnimeParams[K],
    ) => {
      const next = { ...filtersRef.current, [key]: value };
      filtersRef.current = next;
      setFilters(next);
      void performSearch(next);
    },
    [performSearch],
  );

  // Solo actualiza el texto del buscador por nombre, SIN buscar todavía.
  // Sigue requiriendo el botón "Buscar" o Enter — no cambia con este ajuste.
  const updateQuery = useCallback((value: string | undefined) => {
    const next = { ...filtersRef.current, query: value };
    filtersRef.current = next;
    setFilters(next);
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasNextPage) return;

    const nextPage = currentPage + 1;
    setIsLoading(true);

    try {
      const result = await animeService.searchAnime({
        ...activeFiltersRef.current,
        page: nextPage,
      });

      setItems((prev) => {
        // Evita IDs duplicados si AniList repite algún resultado entre páginas
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = result.data.filter(
          (item) => !existingIds.has(item.id),
        );
        return [...prev, ...newItems];
      });

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

  const resetFilters = useCallback(() => {
    filtersRef.current = DEFAULT_FILTERS;
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    items,
    filters,
    isLoading,
    isInitialLoading,
    hasNextPage,
    error,
    search,
    searchByName,
    loadMore,
    applyFilter,
    updateQuery,
    resetFilters,
  } as const;
}
