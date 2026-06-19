import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s4.anilist.co" }, // AniList
      { protocol: "https", hostname: "cdn.myanimelist.net" }, // Jikan / MAL
      { protocol: "https", hostname: "image.tmdb.org" }, // TMDB
      { protocol: "https", hostname: "i.ytimg.com" }, // Youtube
      { protocol: "https", hostname: "img.youtube.com" }, // Youtube
    ],
  },
};

export default nextConfig;
