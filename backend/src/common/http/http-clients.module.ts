import { Module } from '@nestjs/common';
import { AnilistClient } from './anilist/anilist.client';
import { JikanClient } from './jikan/jikan.client';
import { TmdbClient } from './tmdb/tmdb.client';
import { AnimeThemesClient } from './animethemes/animethemes.client';
import { OpenRouterClient } from './openrouter/openrouter.client';

@Module({
  providers: [
    AnilistClient,
    JikanClient,
    TmdbClient,
    AnimeThemesClient,
    OpenRouterClient,
  ],
  exports: [
    AnilistClient,
    JikanClient,
    TmdbClient,
    AnimeThemesClient,
    OpenRouterClient,
  ],
})
export class HttpClientsModule {}
