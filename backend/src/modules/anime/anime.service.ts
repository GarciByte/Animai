import { Injectable } from '@nestjs/common';
import { CacheService } from '../../common/cache/cache.service';
import { AnilistClient } from '../../common/http/anilist/anilist.client';

@Injectable()
export class AnimeService {
  constructor(
    private readonly anilist: AnilistClient,
    private readonly cache: CacheService,
  ) {}
}
