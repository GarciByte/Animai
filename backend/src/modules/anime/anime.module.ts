import { Module } from '@nestjs/common';
import { AnimeService } from './anime.service';
import { AnimeController } from './anime.controller';
import { CacheService } from '../../common/cache/cache.service';
import { HttpClientsModule } from '../../common/http/http-clients.module';

@Module({
  imports: [HttpClientsModule],
  providers: [AnimeService, CacheService],
  controllers: [AnimeController],
})
export class AnimeModule {}
