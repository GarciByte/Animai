"use client";

import { useReducer, useEffect, useCallback } from "react";
import { characterService } from "@/services/character.service";
import { ApiError } from "@/lib/api";
import { CharacterDetailResponse } from "@/types/character.types";

type State = {
  character: CharacterDetailResponse | null;
  isLoading: boolean;
  error: string | null;
};

type Action =
  | { type: "START" }
  | { type: "SUCCESS"; character: CharacterDetailResponse }
  | { type: "ERROR"; error: string };

const initialState: State = { character: null, isLoading: true, error: null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START":
      return { ...state, isLoading: true, error: null };
    case "SUCCESS":
      return { character: action.character, isLoading: false, error: null };
    case "ERROR":
      return { ...state, isLoading: false, error: action.error };
    default:
      return state;
  }
}

export function useCharacterDetail(id: number) {
  const [{ character, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const fetchDetail = useCallback(async () => {
    dispatch({ type: "START" });
    try {
      const result = await characterService.getCharacterDetail(id);
      dispatch({ type: "SUCCESS", character: result });
    } catch (err) {
      dispatch({
        type: "ERROR",
        error:
          err instanceof ApiError
            ? err.message
            : "Error al cargar el personaje",
      });
    }
  }, [id]);

  useEffect(() => {
    void fetchDetail();
  }, [fetchDetail]);

  return { character, isLoading, error } as const;
}
