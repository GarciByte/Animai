import { FuzzyDate, PaginatedResponse } from "./common.types";

// ── Enums del backend, replicados como union types ─────────────────
// Se usan union types de string en lugar de `enum` de TypeScript para
// evitar fricciones con `isolatedModules` (activado por defecto en
// Next.js) y porque no necesitamos el valor en tiempo de ejecución,
// solo el tipado.

export type AnimeSort =
  | "TRENDING_DESC"
  | "POPULARITY_DESC"
  | "SCORE_DESC"
  | "FAVOURITES_DESC"
  | "TITLE_ROMAJI"
  | "START_DATE_DESC";

export type AnimeSeason = "WINTER" | "SPRING" | "SUMMER" | "FALL";

export type AnimeFormat =
  | "TV"
  | "TV_SHORT"
  | "MOVIE"
  | "SPECIAL"
  | "OVA"
  | "ONA"
  | "MUSIC";

export type AnimeStatus =
  | "FINISHED"
  | "RELEASING"
  | "NOT_YET_RELEASED"
  | "CANCELLED"
  | "HIATUS";

export type QuickFilter =
  | "TRENDING"
  | "TOP_ANIME"
  | "CURRENT_SEASON"
  | "TOP_AIRING"
  | "TOP_UPCOMING";

// ── Request: parámetros de búsqueda ─────────────────────────────────

export interface SearchAnimeParams {
  query?: string;
  quickFilter?: QuickFilter;
  sort?: AnimeSort;
  season?: AnimeSeason;
  seasonYear?: number;
  formats?: AnimeFormat[];
  statuses?: AnimeStatus[];
  genres?: string[];
  page?: number;
  perPage?: number;
}

// ── Response: listado ────────────────────────────────────────────

export interface AnimeTitle {
  romaji: string;
  english: string | null;
}

export interface AnimeCoverImage {
  large: string;
  extraLarge: string;
  color: string | null;
}

export interface AnimeListItem {
  id: number;
  title: AnimeTitle;
  coverImage: AnimeCoverImage;
  format: AnimeFormat | null;
  status: AnimeStatus | null;
  episodes: number | null;
  season: AnimeSeason | null;
  seasonYear: number | null;
  averageScore: number | null;
}

export type AnimeSearchResponse = PaginatedResponse<AnimeListItem>;

// ── Response: detalle ────────────────────────────────────────────

export interface AnimeTag {
  id: number;
  name: string;
  description: string;
  category: string;
  rank: number;
}

export interface AnimeStudio {
  id: number;
  name: string;
}

export interface AnimeTrailer {
  id: string;
  site: string;
  thumbnail: string;
}

export interface AnimeExternalLink {
  id: number;
  url: string;
  site: string;
  type: string | null;
  language: string | null;
  color: string | null;
  icon: string | null;
}

export interface AnimeRelation {
  id: number;
  title: AnimeTitle;
  coverImage: string;
  format: AnimeFormat | null;
  status: AnimeStatus | null;
  relationType: string;
  type: string;
}

export interface AnimeCharacterRef {
  id: number;
  name: string;
  image: string;
  role: string; // 'MAIN' | 'SUPPORTING' | 'BACKGROUND'
}

export interface AnimeRecommendation {
  id: number;
  title: AnimeTitle;
  coverImage: string;
  format: AnimeFormat | null;
  averageScore: number | null;
  type: string;
}

export interface AnimeNewsItem {
  malId: number;
  title: string;
  url: string;
  imageUrl: string | null;
  date: string;
  authorUsername: string;
  intro: string;
}

export interface AnimePicture {
  jpg: string;
  webp: string | null;
}

export interface AnimeReviewUser {
  username: string;
  url: string;
  imageUrl: string | null;
}

export interface AnimeReview {
  malId: number;
  url: string;
  date: string;
  review: string;
  score: number;
  tags: string[];
  episodesWatched: number | null;
  user: AnimeReviewUser;
}

export interface AnimePromoVideo {
  title: string;
  youtubeId: string;
  url: string;
  thumbnail: string;
}

export interface AnimeThemeItem {
  slug: string;
  type: 'OP' | 'ED';
  videoUrl: string | null;
  spoiler: boolean;
}

export interface AnimeDetailResponse {
  id: number;
  idMal: number | null;
  title: AnimeTitle & { native: string | null };
  coverImage: AnimeCoverImage;
  bannerImage: string | null;
  format: AnimeFormat | null;
  status: AnimeStatus | null;
  episodes: number | null;
  duration: number | null;
  source: string | null;
  season: AnimeSeason | null;
  seasonYear: number | null;
  startDate: FuzzyDate;
  endDate: FuzzyDate;
  countryOfOrigin: string | null;
  averageScore: number | null;
  meanScore: number | null;
  popularity: number | null;
  favourites: number | null;
  genres: string[];
  tags: AnimeTag[];
  description: string | null;
  studios: AnimeStudio[];
  trailer: AnimeTrailer | null;
  relations: AnimeRelation[];
  characters: AnimeCharacterRef[];
  recommendations: AnimeRecommendation[];
  externalLinks: AnimeExternalLink[];
  // Bloques que dependen de APIs externas: siempre `T[] | null`,
  // nunca solo `T[]`, porque cualquiera puede fallar en el backend
  news: AnimeNewsItem[] | null;
  pictures: AnimePicture[] | null;
  reviews: AnimeReview[] | null;
  promoVideos: AnimePromoVideo[] | null;
  themes: AnimeThemeItem[] | null;
  descriptionEs: string | null;
  posters: string[] | null;
  backdrops: string[] | null;
}
