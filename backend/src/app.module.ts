import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { HttpLoggerMiddleware } from './common/logger/http-logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { HealthController } from './health.controller';
import { AnimeModule } from './modules/anime/anime.module';
import { CharacterModule } from './modules/character/character.module';
import { AiModule } from './modules/ai/ai.module';
import { CacheService } from './common/cache/cache.service';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/logger/logger.config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    CacheModule.register({ isGlobal: true }),
    WinstonModule.forRoot(winstonConfig),
    AnimeModule,
    CharacterModule,
    AiModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, CacheService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL }); // Todas las rutas
  }
}
