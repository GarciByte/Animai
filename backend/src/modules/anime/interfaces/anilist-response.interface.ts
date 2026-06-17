export interface AnilistPageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  perPage: number;
}

export interface AnilistTitle {
  romaji: string;
  english: string | null;
  native?: string | null;
}

export interface AnilistCoverImage {
  large: string;
  extraLarge: string;
  color: string | null;
}

export interface AnilistDate {
  year: number | null;
  month: number | null;
  day: number | null;
}

export interface AnilistTag {
  id: number;
  name: string;
  description: string;
  category: string;
  rank: number;
  isGeneralSpoiler: boolean;
  isMediaSpoiler: boolean;
  isAdult: boolean;
}

export interface AnilistStudio {
  id: number;
  name: string;
  isAnimationStudio: boolean;
}

export interface AnilistTrailer {
  id: string;
  site: string;
  thumbnail: string;
}

export interface AnilistExternalLink {
  id: number;
  url: string;
  site: string;
  type: string | null;
  language: string | null;
  color: string | null;
  icon: string | null;
}

export interface AnilistCharacterEdge {
  role: string;
  node: {
    id: number;
    name: { full: string };
    image: { large: string };
  };
}

export interface AnilistRelationEdge {
  relationType: string;
  node: {
    id: number;
    title: AnilistTitle;
    coverImage: { large: string };
    format: string | null;
    status: string | null;
    type: string;
    isAdult: boolean;
  };
}

export interface AnilistRecommendationNode {
  mediaRecommendation: {
    id: number;
    title: AnilistTitle;
    coverImage: { large: string };
    format: string | null;
    averageScore: number | null;
    isAdult: boolean;
  } | null;
}

// ── Search response ──────────────────────────────────────────────

export interface AnilistMediaBasic {
  id: number;
  title: AnilistTitle;
  coverImage: AnilistCoverImage;
  format: string | null;
  status: string | null;
  episodes: number | null;
  season: string | null;
  seasonYear: number | null;
  averageScore: number | null;
  popularity: number | null;
  trending: number | null;
}

export interface AnilistSearchData {
  Page: {
    pageInfo: AnilistPageInfo;
    media: AnilistMediaBasic[];
  };
}

// ── Detail response ──────────────────────────────────────────────

export interface AnilistMediaDetail {
  id: number;
  idMal: number | null;
  title: AnilistTitle & { native: string | null };
  coverImage: AnilistCoverImage;
  bannerImage: string | null;
  format: string | null;
  status: string | null;
  episodes: number | null;
  duration: number | null;
  source: string | null;
  season: string | null;
  seasonYear: number | null;
  startDate: AnilistDate;
  endDate: AnilistDate;
  countryOfOrigin: string | null;
  averageScore: number | null;
  meanScore: number | null;
  popularity: number | null;
  favourites: number | null;
  genres: string[];
  tags: AnilistTag[];
  description: string | null;
  studios: { nodes: AnilistStudio[] };
  trailer: AnilistTrailer | null;
  externalLinks: AnilistExternalLink[];
  relations: { edges: AnilistRelationEdge[] };
  characters: { edges: AnilistCharacterEdge[] };
  recommendations: { nodes: AnilistRecommendationNode[] };
}

export interface AnilistDetailData {
  Media: AnilistMediaDetail;
}
