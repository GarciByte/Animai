export interface AnimeListItem {
  id: number;
  title: { romaji: string; english: string | null };
  coverImage: { large: string; extraLarge: string; color: string | null };
  format: string | null;
  status: string | null;
  episodes: number | null;
  season: string | null;
  seasonYear: number | null;
  averageScore: number | null;
}

export interface AnimeSearchResponse {
  data: AnimeListItem[];
  pageInfo: {
    total: number;
    currentPage: number;
    lastPage: number;
    hasNextPage: boolean;
    perPage: number;
  };
}

export interface AnimeRelation {
  id: number;
  title: { romaji: string; english: string | null };
  coverImage: string;
  format: string | null;
  status: string | null;
  relationType: string;
  type: string;
}

export interface AnimeCharacter {
  id: number;
  name: string;
  image: string;
  role: string;
}

export interface AnimeRecommendation {
  id: number;
  title: { romaji: string; english: string | null };
  coverImage: string;
  format: string | null;
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

export interface AnimeReview {
  malId: number;
  url: string;
  date: string;
  review: string;
  score: number;
  tags: string[];
  episodesWatched: number | null;
  user: { username: string; url: string; imageUrl: string | null };
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
  // AniList (siempre presente)
  id: number;
  idMal: number | null;
  title: { romaji: string; english: string | null; native: string | null };
  coverImage: { large: string; extraLarge: string; color: string | null };
  bannerImage: string | null;
  format: string | null;
  status: string | null;
  episodes: number | null;
  duration: number | null;
  source: string | null;
  season: string | null;
  seasonYear: number | null;
  startDate: { year: number | null; month: number | null; day: number | null };
  endDate: { year: number | null; month: number | null; day: number | null };
  countryOfOrigin: string | null;
  averageScore: number | null;
  meanScore: number | null;
  popularity: number | null;
  favourites: number | null;
  genres: string[];
  tags: Array<{
    id: number;
    name: string;
    description: string;
    category: string;
    rank: number;
  }>;
  description: string | null;
  studios: Array<{ id: number; name: string }>;
  trailer: { id: string; site: string; thumbnail: string } | null;
  relations: AnimeRelation[];
  characters: AnimeCharacter[];
  recommendations: AnimeRecommendation[];
  externalLinks: Array<{
    id: number;
    url: string;
    site: string;
    type: string | null;
    language: string | null;
    color: string | null;
    icon: string | null;
  }>;

  // Jikan (null si la API falla)
  news: AnimeNewsItem[] | null;
  pictures: AnimePicture[] | null;
  reviews: AnimeReview[] | null;
  promoVideos: AnimePromoVideo[] | null;

  // AnimeThemes (null si la API falla)
  themes: AnimeThemeItem[] | null;

  // TMDB (null si la API falla)
  descriptionEs: string | null;
  posters: string[] | null;
  backdrops: string[] | null;
}
