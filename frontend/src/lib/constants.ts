import { SelectedCharacter } from "@/types/ai.types";
import {
  AnimeSort,
  AnimeSeason,
  AnimeFormat,
  AnimeStatus,
  QuickFilter,
} from "@/types/anime.types";

// ── API ──────────────────────────────────────────────────────────

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// ── Claves de localStorage ──────────────────────────────────────
// Centralizadas para no repetir strings sueltos por el código

export const STORAGE_KEYS = {
  SELECTED_CHARACTER: "animai_selected_character",
  CHAT_HISTORY: "animai_chat_history",
} as const;

// ── Personaje por defecto de la IA ─────────────────────────────────

export const DEFAULT_CHARACTER: SelectedCharacter = {
  id: 34470,
  characterName: "Kurisu Makise",
  animeName: "Steins;Gate",
  characterDescription: `Kurisu es miembro de investigación del Programa de Investigación Cerebral de la Universidad Viktor Chondria. Su edad coincide con la de los alumnos en su penúltimo año de secundaria, pero se saltó un grado a través del sistema educativo estadounidense. También es famosa en Estados Unidos por escribir artículos académicos, algunos de los cuales han aparecido en las noticias. Debido a que, siendo una chica, adelantó un grado en Estados Unidos, la gente a su alrededor la envidiaba, y eso acabó forjándola como una persona de carácter fuerte. No quiere mostrar debilidad a los demás, así que siempre mantiene una expresión severa. Sin embargo, es muy curiosa y, cuando algo le interesa, se mete de lleno en ello. Ocasionalmente, tiene opiniones que difieren de las comunes, como: «Los datos del experimento son más importantes que la privacidad del sujeto». Rintarou suele decirle: «Oye, tienes un sentido bastante bueno para ser una científica loca», pero ella no está dispuesta a aceptar algo así personalmente. Es una tundere.`,
  image:
    "https://s4.anilist.co/file/anilistcdn/character/large/b34470-Jw2LXZBL5R8i.png",
};

// ── Chat ─────────────────────────────────────────────────────────

// Debe coincidir con el límite definido en ChatDto del backend
export const MAX_CHAT_HISTORY = 30;

// ── Vistas rápidas del buscador de anime ────────────────────────

export const QUICK_FILTER_OPTIONS: { value: QuickFilter; label: string }[] = [
  { value: "TRENDING", label: "Trending Now" },
  { value: "TOP_ANIME", label: "Top Anime Series" },
  { value: "CURRENT_SEASON", label: "Current Season Anime Series" },
  { value: "TOP_AIRING", label: "Top Airing Anime" },
  { value: "TOP_UPCOMING", label: "Top Upcoming Anime" },
];

// ── Ordenación ───────────────────────────────────────────────────

export const SORT_OPTIONS: { value: AnimeSort; label: string }[] = [
  { value: "TRENDING_DESC", label: "Tendencias" },
  { value: "POPULARITY_DESC", label: "Popularidad" },
  { value: "SCORE_DESC", label: "Puntuación" },
  { value: "FAVOURITES_DESC", label: "Favoritos" },
  { value: "TITLE_ROMAJI", label: "Título" },
  { value: "START_DATE_DESC", label: "Últimos añadidos" },
];

// ── Filtros ──────────────────────────────────────────────────────

export const SEASON_OPTIONS: { value: AnimeSeason; label: string }[] = [
  { value: "WINTER", label: "Invierno" },
  { value: "SPRING", label: "Primavera" },
  { value: "SUMMER", label: "Verano" },
  { value: "FALL", label: "Otoño" },
];

export const FORMAT_OPTIONS: { value: AnimeFormat; label: string }[] = [
  { value: "TV", label: "TV" },
  { value: "TV_SHORT", label: "TV Short" },
  { value: "MOVIE", label: "Película" },
  { value: "SPECIAL", label: "Especial" },
  { value: "OVA", label: "OVA" },
  { value: "ONA", label: "ONA" },
  { value: "MUSIC", label: "Música" },
];

export const STATUS_OPTIONS: { value: AnimeStatus; label: string }[] = [
  { value: "FINISHED", label: "Finalizado" },
  { value: "RELEASING", label: "En emisión" },
  { value: "NOT_YET_RELEASED", label: "Próximamente" },
  { value: "CANCELLED", label: "Cancelado" },
  { value: "HIATUS", label: "En pausa" },
];

// Para el selector de años en los filtros
export const CURRENT_YEAR = new Date().getFullYear();
export const YEAR_OPTIONS: number[] = Array.from(
  { length: CURRENT_YEAR + 1 - 1960 + 1 },
  (_, i) => CURRENT_YEAR + 1 - i,
);
