import { Module } from '@nestjs/common';
import { CacheService } from '../../common/cache/cache.service';
import { HttpClientsModule } from '../../common/http/http-clients.module';
import { AnimeController } from './anime.controller';
import { AnimeService } from './anime.service';

@Module({
  imports: [HttpClientsModule],
  controllers: [AnimeController],
  providers: [AnimeService, CacheService],
})
export class AnimeModule {}
