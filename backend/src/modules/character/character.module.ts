import { Module } from '@nestjs/common';
import { CacheService } from '../../common/cache/cache.service';
import { HttpClientsModule } from '../../common/http/http-clients.module';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';

@Module({
  imports: [HttpClientsModule],
  controllers: [CharacterController],
  providers: [CharacterService, CacheService],
})
export class CharacterModule {}
