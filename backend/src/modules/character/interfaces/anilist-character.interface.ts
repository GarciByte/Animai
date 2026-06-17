// ── Tipos compartidos ────────────────────────────────────────────

export interface AnilistCharacterName {
  full: string;
  native: string | null;
}

export interface AnilistCharacterImage {
  large: string;
}

export interface AnilistCharacterMediaTitle {
  romaji: string;
  english: string | null;
}

export interface AnilistPageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  perPage: number;
}

// ── Search response ──────────────────────────────────────────────

export interface AnilistCharacterMediaNode {
  title: AnilistCharacterMediaTitle;
  isAdult: boolean;
}

export interface AnilistCharacterSearchNode {
  id: number;
  name: AnilistCharacterName;
  image: AnilistCharacterImage;
  media: {
    nodes: AnilistCharacterMediaNode[];
  };
}

export interface AnilistCharacterSearchData {
  Page: {
    pageInfo: AnilistPageInfo;
    characters: AnilistCharacterSearchNode[];
  };
}

// ── Detail response ──────────────────────────────────────────────

export interface AnilistFuzzyDate {
  year: number | null;
  month: number | null;
  day: number | null;
}

export interface AnilistCharacterMediaEdge {
  characterRole: string; // 'MAIN' | 'SUPPORTING' | 'BACKGROUND'
  node: {
    id: number;
    title: AnilistCharacterMediaTitle;
    coverImage: { large: string };
    format: string | null;
    startDate: AnilistFuzzyDate;
    type: string; // 'ANIME' | 'MANGA'
    isAdult: boolean;
  };
}

export interface AnilistCharacterDetail {
  id: number;
  name: AnilistCharacterName;
  image: AnilistCharacterImage;
  favourites: number | null;
  description: string | null;
  age: string | null;
  gender: string | null;
  bloodType: string | null;
  dateOfBirth: AnilistFuzzyDate;
  media: {
    edges: AnilistCharacterMediaEdge[];
  };
}

export interface AnilistCharacterDetailData {
  Character: AnilistCharacterDetail;
}
