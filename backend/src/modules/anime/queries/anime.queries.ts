export const SEARCH_ANIME_QUERY = `
  query SearchAnime(
    $page: Int
    $perPage: Int
    $search: String
    $sort: [MediaSort]
    $season: MediaSeason
    $seasonYear: Int
    $format_in: [MediaFormat]
    $status_in: [MediaStatus]
    $genre_in: [String]
    $isAdult: Boolean
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(
        search: $search
        sort: $sort
        season: $season
        seasonYear: $seasonYear
        format_in: $format_in
        status_in: $status_in
        genre_in: $genre_in
        isAdult: $isAdult
        type: ANIME
      ) {
        id
        title { romaji english }
        coverImage { large extraLarge color }
        format
        status
        episodes
        season
        seasonYear
        averageScore
        popularity
        trending
      }
    }
  }
`;

export const ANIME_DETAIL_QUERY = `
  query AnimeDetail($id: Int, $isAdult: Boolean) {
    Media(id: $id, type: ANIME, isAdult: $isAdult) {
      id
      idMal
      title { romaji english native }
      coverImage { large extraLarge color }
      bannerImage
      format
      status
      episodes
      duration
      source
      season
      seasonYear
      startDate { year month day }
      endDate { year month day }
      countryOfOrigin
      averageScore
      meanScore
      popularity
      favourites
      genres
      tags {
        id name description category rank
        isGeneralSpoiler isMediaSpoiler isAdult
      }
      description(asHtml: false)
      studios(isMain: true) {
        nodes { id name isAnimationStudio }
      }
      trailer { id site thumbnail }
      externalLinks { id url site type language color icon }
      relations {
        edges {
          relationType
          node {
            id
            title { romaji english }
            coverImage { large }
            format status type isAdult
          }
        }
      }
      characters(sort: [ROLE, RELEVANCE], page: 1, perPage: 25) {
        edges {
          role
          node {
            id
            name { full }
            image { large }
          }
        }
      }
      recommendations(sort: RATING_DESC, page: 1, perPage: 10) {
        nodes {
          mediaRecommendation {
            id
            title { romaji english }
            coverImage { large }
            format averageScore type isAdult
          }
        }
      }
    }
  }
`;
