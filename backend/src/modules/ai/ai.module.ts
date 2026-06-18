import { Module } from '@nestjs/common';
import { CacheService } from '../../common/cache/cache.service';
import { HttpClientsModule } from '../../common/http/http-clients.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [HttpClientsModule],
  controllers: [AiController],
  providers: [AiService, CacheService],
})
export class AiModule {}
