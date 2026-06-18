import { FuzzyDate } from "./common.types";

// ── Personaje asignado a la IA (persistido en localStorage) ────────

export interface SelectedCharacter {
  id: number;
  characterName: string;
  animeName: string;
  characterDescription: string;
  image: string;
}

// ── Chat ─────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  character: SelectedCharacter;
  messages: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
}

// ── Analyze anime ────────────────────────────────────────────────
// Mismos campos opcionales que admite AnalyzeAnimeDataDto en el backend

export interface AnalyzeAnimeTag {
  name: string;
  category?: string | null;
}

export interface AnalyzeAnimeStudio {
  name: string;
}

export interface AnalyzeAnimeCharacterRef {
  name: string;
  role: string;
}

export interface AnalyzeAnimeRelationRef {
  title: string;
  relationType: string;
}

export interface AnalyzeAnimeData {
  id: number;
  title: { romaji: string; english?: string | null };
  description?: string | null;
  format?: string | null;
  status?: string | null;
  episodes?: number | null;
  duration?: number | null;
  source?: string | null;
  season?: string | null;
  seasonYear?: number | null;
  startDate?: FuzzyDate;
  endDate?: FuzzyDate;
  countryOfOrigin?: string | null;
  averageScore?: number | null;
  meanScore?: number | null;
  popularity?: number | null;
  favourites?: number | null;
  genres?: string[];
  tags?: AnalyzeAnimeTag[];
  studios?: AnalyzeAnimeStudio[];
  characters?: AnalyzeAnimeCharacterRef[];
  relations?: AnalyzeAnimeRelationRef[];
}

export interface AnalyzeAnimeRequest {
  character: SelectedCharacter;
  anime: AnalyzeAnimeData;
}

// ── Analyze character ────────────────────────────────────────────

export interface AnalyzeCharacterAppearance {
  title: string;
  year?: number | null;
  role: string;
}

export interface AnalyzeCharacterData {
  id: number;
  name: string;
  nativeName?: string | null;
  description?: string | null;
  age?: string | null;
  gender?: string | null;
  bloodType?: string | null;
  height?: string | null;
  birthday?: FuzzyDate;
  favourites?: number | null;
  mediaMain?: AnalyzeCharacterAppearance[];
  mediaSupporting?: AnalyzeCharacterAppearance[];
}

export interface AnalyzeCharacterRequest {
  character: SelectedCharacter;
  targetCharacter: AnalyzeCharacterData;
}

export interface AnalysisResponse {
  analysis: string;
}

// ── Translate ────────────────────────────────────────────────────

export type TranslationContext =
  | "GENERIC"
  | "ANIME_DESCRIPTION"
  | "CHARACTER_DESCRIPTION";

export interface TranslateAnimeContext {
  title: string;
  genres?: string[];
  format?: string | null;
  tags?: string[];
}

export interface TranslateCharacterContext {
  name: string;
  animeName?: string | null;
  gender?: string | null;
  age?: string | null;
}

export interface TranslateRequest {
  text: string;
  context?: TranslationContext;
  animeContext?: TranslateAnimeContext;
  characterContext?: TranslateCharacterContext;
}

export interface TranslateResponse {
  translatedText: string;
}
