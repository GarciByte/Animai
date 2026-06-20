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

  // Refleja el texto del buscador de forma síncrona
  const queryRef = useRef("");
  // Snapshot de la query con la que se hizo la última petición real;
  // loadMore pagina siempre sobre esta, no sobre texto a medio escribir
  const activeQueryRef = useRef("");

  const isInitialLoading = isLoading && items.length === 0;

  const performSearch = useCallback(async (q: string) => {
    activeQueryRef.current = q;

    setIsLoading(true);
    setError(null);
    setItems([]);
    setCurrentPage(1);
    setHasNextPage(false);

    try {
      const result = await characterService.searchCharacters({
        query: q || undefined,
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
  }, []);

  // Identidad estable: no depende de closures sobre `query`, así que
  // se puede meter en las deps de un useEffect de montaje sin riesgo.
  const search = useCallback(
    () => performSearch(queryRef.current),
    [performSearch],
  );

  const setQuery = useCallback((value: string) => {
    queryRef.current = value;
    setQueryState(value);
  }, []);

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

      setItems((prev) => {
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
        err instanceof ApiError
          ? err.message
          : "Error al cargar más personajes";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, hasNextPage, isLoading]);

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
