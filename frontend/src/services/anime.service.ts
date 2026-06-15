import { API_URL } from "@/lib/constants";

export const animeService = {
  search: async (query: string) => {
    const res = await fetch(`${API_URL}/api/anime/search?q=${query}`);
    return res.json();
  },
};
