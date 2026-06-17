import { CacheModule } from '@nestjs/cache-manager';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheService } from './common/cache/cache.service';
import { AnilistClient } from './common/http/anilist/anilist.client';
import { AnimeThemesClient } from './common/http/animethemes/animethemes.client';
import { HttpClientsModule } from './common/http/http-clients.module';
import { JikanClient } from './common/http/jikan/jikan.client';
import { OpenRouterClient } from './common/http/openrouter/openrouter.client';
import { TmdbClient } from './common/http/tmdb/tmdb.client';
import { HttpLoggerMiddleware } from './common/logger/http-logger.middleware';
import { winstonConfig } from './common/logger/logger.config';
import configuration from './config/configuration';
import { HealthController } from './health.controller';
import { AiModule } from './modules/ai/ai.module';
import { AnimeModule } from './modules/anime/anime.module';
import { CharacterModule } from './modules/character/character.module';

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
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          name: 'default',
          ttl: config.get<number>('throttle.ttl') ?? 60000,
          limit: config.get<number>('throttle.limit') ?? 20,
        },
      ],
    }),
    AnimeModule,
    CharacterModule,
    AiModule,
    HttpClientsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
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
