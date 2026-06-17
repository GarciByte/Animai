export interface CharacterListItem {
  id: number;
  name: string;
  image: string;
  mediaTitle: string | null;
}

export interface CharacterSearchResponse {
  data: CharacterListItem[];
  pageInfo: {
    total: number;
    currentPage: number;
    lastPage: number;
    hasNextPage: boolean;
    perPage: number;
  };
}

export interface CharacterAnimeAppearance {
  id: number;
  title: { romaji: string; english: string | null };
  coverImage: string;
  year: number | null;
  format: string | null;
  role: string; // 'MAIN' | 'SUPPORTING' | 'BACKGROUND'
}

export interface CharacterBirthday {
  year: number | null;
  month: number | null;
  day: number | null;
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
  birthday: CharacterBirthday | null;
  mediaMain: CharacterAnimeAppearance[];
  mediaSupporting: CharacterAnimeAppearance[];
}
