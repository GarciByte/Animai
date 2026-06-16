import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { HttpLoggerMiddleware } from './common/logger/http-logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { HealthController } from './health.controller';
import { AnimeModule } from './modules/anime/anime.module';
import { CharacterModule } from './modules/character/character.module';
import { AiModule } from './modules/ai/ai.module';
import { CacheService } from './common/cache/cache.service';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/logger/logger.config';
import { AnilistClient } from './common/http/anilist/anilist.client';
import { JikanClient } from './common/http/jikan/jikan.client';
import { TmdbClient } from './common/http/tmdb/tmdb.client';
import { AnimeThemesClient } from './common/http/animethemes/animethemes.client';
import { OpenRouterClient } from './common/http/openrouter/openrouter.client';
import { HttpClientsModule } from './common/http/http-clients.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get<number>('cacheTtl') ?? 300,
      }),
    }),
    WinstonModule.forRoot(winstonConfig),
    AnimeModule,
    CharacterModule,
    AiModule,
    HttpClientsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    CacheService,
    AnilistClient,
    JikanClient,
    TmdbClient,
    AnimeThemesClient,
    OpenRouterClient,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL }); // Todas las rutas
  }
}
