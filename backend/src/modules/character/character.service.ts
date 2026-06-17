import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CacheService } from '../../common/cache/cache.service';
import { AnilistClient } from '../../common/http/anilist/anilist.client';
import { SearchCharacterDto } from './dto/search-character.dto';
import {
  AnilistCharacterDetail,
  AnilistCharacterDetailData,
  AnilistCharacterSearchData,
  AnilistFuzzyDate,
} from './interfaces/anilist-character.interface';
import {
  CharacterAnimeAppearance,
  CharacterBirthday,
  CharacterDetailResponse,
  CharacterSearchResponse,
} from './interfaces/character-response.interface';
import {
  CHARACTER_DETAIL_QUERY,
  SEARCH_CHARACTERS_QUERY,
} from './queries/character.queries';

@Injectable()
export class CharacterService {
  constructor(
    private readonly anilist: AnilistClient,
    private readonly cache: CacheService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  // ── Search ────────────────────────────────────────────────────────

  async searchCharacters(
    dto: SearchCharacterDto,
  ): Promise<CharacterSearchResponse> {
    const page = dto.page ?? 1;
    const perPage = dto.perPage ?? 20;

    // Sin búsqueda: ordenado por popularidad.
    // Con búsqueda: prioriza coincidencias de nombre, luego popularidad.
    const sort = dto.query
      ? ['SEARCH_MATCH', 'FAVOURITES_DESC']
      : ['FAVOURITES_DESC'];

    const variables = {
      page,
      perPage,
      sort,
      ...(dto.query ? { search: dto.query } : {}),
    };

    const cacheKey = this.buildCacheKey('character:search', variables);
    const cached = await this.cache.get<CharacterSearchResponse>(cacheKey);
    if (cached) {
      this.logger.debug('Cache hit: character search', { cacheKey });
      return cached;
    }

    this.logger.info('Fetching character list from AniList', { variables });

    const data = await this.anilist.query<AnilistCharacterSearchData>(
      SEARCH_CHARACTERS_QUERY,
      variables,
    );

    const result: CharacterSearchResponse = {
      data: data.Page.characters.map((c) => ({
        id: c.id,
        name: c.name.full,
        image: c.image.large,
        // El primer anime no-adulto de la lista de obras del personaje,
        // ordenada por popularidad
        mediaTitle: c.media.nodes.find((n) => !n.isAdult)?.title.romaji ?? null,
      })),
      pageInfo: data.Page.pageInfo,
    };

    await this.cache.set(cacheKey, result, 300); // 5 minutos
    return result;
  }

  // ── Detail ────────────────────────────────────────────────────────

  async getCharacterDetail(id: number): Promise<CharacterDetailResponse> {
    const cacheKey = `character:detail:${id}`;

    const cached = await this.cache.get<CharacterDetailResponse>(cacheKey);
    if (cached) {
      this.logger.debug('Cache hit: character detail', { id });
      return cached;
    }

    this.logger.info('Fetching character detail from AniList', { id });

    let data: AnilistCharacterDetailData;
    try {
      data = await this.anilist.query<AnilistCharacterDetailData>(
        CHARACTER_DETAIL_QUERY,
        { id },
      );
    } catch (err) {
      this.logger.error('AniList character detail fetch failed', {
        id,
        error: err as unknown,
      });
      throw new NotFoundException(`Personaje con ID ${id} no encontrado`);
    }

    const result = this.buildDetailResponse(data.Character);
    await this.cache.set(cacheKey, result, 3600); // 1 hora
    return result;
  }

  // ── Private: Build response ───────────────────────────────────────

  private buildDetailResponse(
    char: AnilistCharacterDetail,
  ): CharacterDetailResponse {
    // Solo animes (no manga) y sin contenido adulto.
    // AniList ya devuelve `edges` ordenados por START_DATE_ASC gracias
    // a la query, así que el orden se conserva al filtrar y agrupar.
    const appearances: CharacterAnimeAppearance[] = char.media.edges
      .filter((e) => e.node.type === 'ANIME' && !e.node.isAdult)
      .map((e) => ({
        id: e.node.id,
        title: {
          romaji: e.node.title.romaji,
          english: e.node.title.english ?? null,
        },
        coverImage: e.node.coverImage.large,
        year: e.node.startDate.year ?? null,
        format: e.node.format ?? null,
        role: e.characterRole,
      }));

    const mediaMain = appearances.filter((a) => a.role === 'MAIN');
    // BACKGROUND se agrupa junto a SUPPORTING, ya que el requisito
    // solo define dos bloques (MAIN y SUPPORTING)
    const mediaSupporting = appearances.filter((a) => a.role !== 'MAIN');

    return {
      id: char.id,
      name: char.name.full,
      nativeName: char.name.native ?? null,
      image: char.image.large,
      favourites: char.favourites ?? null,
      description: this.stripSpoilers(char.description),
      age: char.age ?? null,
      gender: char.gender ?? null,
      bloodType: char.bloodType ?? null,
      height: null, // AniList no expone este campo para personajes
      birthday: this.resolveBirthday(char.dateOfBirth),
      mediaMain,
      mediaSupporting,
    };
  }

  // ── Private: Helpers ──────────────────────────────────────────────

  /**
   * AniList marca el texto de spoiler en las descripciones de personajes
   * con la sintaxis ~!texto oculto!~. Lo eliminamos por completo en lugar
   * de mostrarlo, ya que el requisito pide "todo sin spoilers".
   */
  private stripSpoilers(description: string | null): string | null {
    if (!description) return null;
    const cleaned = description.replace(/~![\s\S]*?!~/g, '').trim();
    return cleaned.length > 0 ? cleaned : null;
  }

  private resolveBirthday(date: AnilistFuzzyDate): CharacterBirthday | null {
    if (date.year === null && date.month === null && date.day === null) {
      return null;
    }
    return date;
  }

  private buildCacheKey(
    prefix: string,
    params: Record<string, unknown>,
  ): string {
    const sorted = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .sort(([a], [b]) => a.localeCompare(b));
    return `${prefix}:${JSON.stringify(sorted)}`;
  }
}
