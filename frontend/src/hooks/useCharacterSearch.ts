"use client";

import { useState, useCallback, useRef } from "react";
import { characterService } from "@/services/character.service";
import { ApiError } from "@/lib/api";
import { CharacterListItem } from "@/types/character.types";

export function useCharacterSearch() {
  const [items, setItems] = useState<CharacterListItem[]>([]);
  const [query, setQueryState] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Congela la query en el momento de buscar para que loadMore
  // pagine sobre los mismos resultados
  const activeQueryRef = useRef("");

  const isInitialLoading = isLoading && items.length === 0;

  const search = useCallback(async () => {
    activeQueryRef.current = query;

    setIsLoading(true);
    setError(null);
    setItems([]);
    setCurrentPage(1);
    setHasNextPage(false);

    try {
      const result = await characterService.searchCharacters({
        query: activeQueryRef.current || undefined,
        page: 1,
        perPage: 20,
      });

      setItems(result.data);
      setHasNextPage(result.pageInfo.hasNextPage);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Error inesperado al cargar los personajes";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasNextPage) return;

    const nextPage = currentPage + 1;
    setIsLoading(true);

    try {
      const result = await characterService.searchCharacters({
        query: activeQueryRef.current || undefined,
        page: nextPage,
        perPage: 20,
      });

      setItems((prev) => [...prev, ...result.data]);
      setHasNextPage(result.pageInfo.hasNextPage);
      setCurrentPage(nextPage);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Error al cargar más personajes";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, hasNextPage, isLoading]);

  const setQuery = useCallback((value: string) => {
    setQueryState(value);
  }, []);

  return {
    items,
    query,
    isLoading,
    isInitialLoading,
    hasNextPage,
    error,
    search,
    loadMore,
    setQuery,
  } as const;
}
