export default () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  frontendUrl: process.env.FRONTEND_URL,
  cacheTtl: parseInt(process.env.CACHE_TTL ?? '300', 10),
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL ?? '60000', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT ?? '20', 10),
  },
  anilist: { apiUrl: process.env.ANILIST_API_URL },
  jikan: { apiUrl: process.env.JIKAN_API_URL },
  animethemes: { apiUrl: process.env.ANIMETHEMES_API_URL },
  tmdb: {
    apiUrl: process.env.TMDB_API_URL,
    apiKey: process.env.TMDB_API_KEY,
  },
  openrouter: {
    apiUrl: process.env.OPENROUTER_API_URL,
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL,
  },
});
