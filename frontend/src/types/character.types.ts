import { FuzzyDate, PaginatedResponse } from "./common.types";
import { AnimeFormat } from "./anime.types";

// ── Request ──────────────────────────────────────────────────────

export interface SearchCharacterParams {
  query?: string;
  page?: number;
  perPage?: number;
}

// ── Response: listado ────────────────────────────────────────────

export interface CharacterListItem {
  id: number;
  name: string;
  image: string;
  mediaTitle: string | null;
}

export type CharacterSearchResponse = PaginatedResponse<CharacterListItem>;

// ── Response: detalle ────────────────────────────────────────────

export interface CharacterAnimeAppearance {
  id: number;
  title: { romaji: string; english: string | null };
  coverImage: string;
  year: number | null;
  format: AnimeFormat | null;
  role: string; // 'MAIN' | 'SUPPORTING' | 'BACKGROUND'
}

export interface CharacterDetailResponse {
  id: number;
  name: string;
  nativeName: string | null;
  image: string;
  favourites: number | null;
  description: string | null;
  age: string | null;
  gender: string | null;
  bloodType: string | null;
  height: string | null;
  birthday: FuzzyDate | null;
  mediaMain: CharacterAnimeAppearance[];
  mediaSupporting: CharacterAnimeAppearance[];
}
