import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Dominios desde los que Next.js permite cargar imágenes con <Image />
    // Las imágenes de anime vienen de estos dominios
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s4.anilist.co", // imágenes de AniList
      },
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net", // imágenes de Jikan/MAL
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org", // imágenes de TMDB
      },
    ],
  },
};

export default nextConfig;
