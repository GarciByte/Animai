// ── Jikan ────────────────────────────────────────────────────────

export interface JikanImage {
  image_url: string | null;
  large_image_url: string | null;
}

export interface JikanNewsItem {
  mal_id: number;
  title: string;
  url: string;
  images: { jpg: JikanImage } | null;
  date: string;
  author_username: string;
  intro: string;
}

export interface JikanNewsResponse {
  data: JikanNewsItem[];
}

export interface JikanPictureItem {
  jpg: JikanImage;
  webp: JikanImage | null;
}

export interface JikanPicturesResponse {
  data: JikanPictureItem[];
}

export interface JikanReviewItem {
  mal_id: number;
  url: string;
  date: string;
  review: string;
  score: number;
  tags: string[];
  is_spoiler: boolean;
  episodes_watched: number | null;
  user: {
    username: string;
    url: string;
    images: { jpg: JikanImage } | null;
  };
}

export interface JikanReviewsResponse {
  data: JikanReviewItem[];
}

export interface JikanPromoItem {
  title: string;
  trailer: {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
    images: {
      image_url: string | null;
      maximum_image_url: string | null;
    } | null;
  };
}

export interface JikanMusicVideoItem {
  title: string;
  video: {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
    images: { maximum_image_url: string | null } | null;
  };
  meta: { title: string | null; author: string | null };
}

export interface JikanVideosResponse {
  data: {
    promo: JikanPromoItem[];
    music_videos: JikanMusicVideoItem[];
  };
}

// ── AnimeThemes ──────────────────────────────────────────────────

export interface AnimeThemesVideo {
  resolution: number;
  link: string;
}

export interface AnimeThemesEntry {
  spoiler: boolean;
  videos: AnimeThemesVideo[];
}

export interface AnimeTheme {
  id: number;
  slug: string;
  type: 'OP' | 'ED';
  animethemeentries: AnimeThemesEntry[];
}

export interface AnimeThemesAnimeDetail {
  name: string;
  slug: string;
  animethemes?: AnimeTheme[];
}

export interface AnimeThemesAnimeResponse {
  anime?: AnimeThemesAnimeDetail;
}

export interface AnimeThemesSearchItem {
  name: string;
  slug: string;
  year: number | null;
  animethemes?: AnimeTheme[];
}

export interface AnimeThemesSearchResponse {
  anime?: AnimeThemesSearchItem[];
}

// ── TMDB ─────────────────────────────────────────────────────────

export interface TmdbSearchResult {
  id: number;
  name: string;
  overview: string;
  first_air_date: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
  origin_country: string[];
}

export interface TmdbSearchResponse {
  results: TmdbSearchResult[];
  total_results: number;
}

export interface TmdbImageItem {
  file_path: string;
  width: number;
  height: number;
  iso_639_1: string | null;
}

export interface TmdbImagesResponse {
  id: number;
  backdrops: TmdbImageItem[];
  posters: TmdbImageItem[];
}

export interface TmdbTvDetail {
  id: number;
  name: string;
  overview: string;
}

export interface TmdbMovieSearchResult {
  id: number;
  title: string;
  release_date: string | null;
  genre_ids: number[];
  original_language: string;
}

export interface TmdbMovieSearchResponse {
  results: TmdbMovieSearchResult[];
}
