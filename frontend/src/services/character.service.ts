import { fetchApi, buildQueryString } from "@/lib/api";
import {
  SearchCharacterParams,
  CharacterSearchResponse,
  CharacterDetailResponse,
} from "@/types/character.types";

export const characterService = {
  searchCharacters(
    params: SearchCharacterParams,
  ): Promise<CharacterSearchResponse> {
    const qs = buildQueryString(params as Record<string, unknown>);
    return fetchApi<CharacterSearchResponse>(`/api/characters${qs}`);
  },

  getCharacterDetail(id: number): Promise<CharacterDetailResponse> {
    return fetchApi<CharacterDetailResponse>(`/api/characters/${id}`);
  },
};
