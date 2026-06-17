export const SEARCH_CHARACTERS_QUERY = `
  query SearchCharacters($page: Int, $perPage: Int, $search: String, $sort: [CharacterSort]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      characters(search: $search, sort: $sort) {
        id
        name { full }
        image { large }
        media(sort: POPULARITY_DESC, type: ANIME, perPage: 3) {
          nodes {
            title { romaji }
            isAdult
          }
        }
      }
    }
  }
`;

export const CHARACTER_DETAIL_QUERY = `
  query CharacterDetail($id: Int) {
    Character(id: $id) {
      id
      name { full native }
      image { large }
      favourites
      description(asHtml: false)
      age
      gender
      bloodType
      dateOfBirth { year month day }
      media(sort: START_DATE, type: ANIME, page: 1, perPage: 50) {
        edges {
          characterRole
          node {
            id
            title { romaji english }
            coverImage { large }
            format
            startDate { year month day }
            type
            isAdult
          }
        }
      }
    }
  }
`;
