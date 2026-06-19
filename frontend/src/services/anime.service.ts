import { fetchApi, buildQueryString } from "@/lib/api";
import {
  SearchAnimeParams,
  AnimeSearchResponse,
  AnimeDetailResponse,
} from "@/types/anime.types";

export const animeService = {
  searchAnime(params: SearchAnimeParams): Promise<AnimeSearchResponse> {
    const qs = buildQueryString(params as Record<string, unknown>);
    return fetchApi<AnimeSearchResponse>(`/api/anime${qs}`);
  },

  getAnimeDetail(id: number): Promise<AnimeDetailResponse> {
    return fetchApi<AnimeDetailResponse>(`/api/anime/${id}`);
  },
};
