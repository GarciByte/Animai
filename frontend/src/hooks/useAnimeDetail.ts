"use client";

import { useReducer, useEffect, useCallback } from "react";
import { animeService } from "@/services/anime.service";
import { ApiError } from "@/lib/api";
import { AnimeDetailResponse } from "@/types/anime.types";

type State = {
  anime: AnimeDetailResponse | null;
  isLoading: boolean;
  error: string | null;
};

type Action =
  | { type: "START" }
  | { type: "SUCCESS"; anime: AnimeDetailResponse }
  | { type: "ERROR"; error: string };

const initialState: State = { anime: null, isLoading: true, error: null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START":
      return { ...state, isLoading: true, error: null };
    case "SUCCESS":
      return { anime: action.anime, isLoading: false, error: null };
    case "ERROR":
      return { ...state, isLoading: false, error: action.error };
    default:
      return state;
  }
}

export function useAnimeDetail(id: number) {
  const [{ anime, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const fetchDetail = useCallback(async () => {
    dispatch({ type: "START" });
    try {
      const result = await animeService.getAnimeDetail(id);
      dispatch({ type: "SUCCESS", anime: result });
    } catch (err) {
      dispatch({
        type: "ERROR",
        error:
          err instanceof ApiError ? err.message : "Error al cargar el anime",
      });
    }
  }, [id]);

  useEffect(() => {
    void fetchDetail();
  }, [fetchDetail]);

  return { anime, isLoading, error, refetch: fetchDetail } as const;
}
