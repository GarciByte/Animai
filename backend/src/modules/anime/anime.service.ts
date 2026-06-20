import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CacheService } from '../../common/cache/cache.service';
import { AnilistClient } from '../../common/http/anilist/anilist.client';
import { AnimeThemesClient } from '../../common/http/animethemes/animethemes.client';
import { JikanClient } from '../../common/http/jikan/jikan.client';
import { TmdbClient } from '../../common/http/tmdb/tmdb.client';
import {
  AnimeSeason,
  AnimeSort,
  QuickFilter,
  SearchAnimeDto,
} from './dto/search-anime.dto';
import {
  AnilistDetailData,
  AnilistMediaDetail,
  AnilistSearchData,
} from './interfaces/anilist-response.interface';
import {
  AnimeCharacter,
  AnimeDetailResponse,
  AnimeNewsItem,
  AnimePicture,
  AnimePromoVideo,
  AnimeRecommendation,
  AnimeRelation,
  AnimeReview,
  AnimeSearchResponse,
  AnimeThemeItem,
} from './interfaces/anime-response.interface';
import {
  AnimeTheme,
  AnimeThemesAnimeResponse,
  AnimeThemesSearchResponse,
  JikanNewsResponse,
  JikanPicturesResponse,
  JikanReviewsResponse,
  JikanVideosResponse,
  TmdbImagesResponse,
  TmdbMovieSearchResponse,
  TmdbMovieSearchResult,
  TmdbSearchResponse,
  TmdbSearchResult,
  TmdbTvDetail,
} from './interfaces/external-apis.interface';
import {
  ANIME_DETAIL_QUERY,
  SEARCH_ANIME_QUERY,
} from './queries/anime.queries';

// Resultado interno de fetchJikanData
interface JikanBundle {
  news: JikanNewsResponse | null;
  pictures: JikanPicturesResponse | null;
  reviews: JikanReviewsResponse | null;
  videos: JikanVideosResponse | null;
}

// Resultado interno de fetchTmdbData
interface TmdbBundle {
  images: TmdbImagesResponse | null;
  detail: TmdbTvDetail | null;
}

@Injectable()
export class AnimeService {
  private readonly TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

  constructor(
    private readonly anilist: AnilistClient,
    private readonly jikan: JikanClient,
    private readonly tmdb: TmdbClient,
    private readonly animeThemes: AnimeThemesClient,
    private readonly cache: CacheService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  // ── Search ────────────────────────────────────────────────────────

  async searchAnime(dto: SearchAnimeDto): Promise<AnimeSearchResponse> {
    const variables = this.resolveSearchVariables(dto);
    const cacheKey = this.buildCacheKey('anime:search', variables);

    const cached = await this.cache.get<AnimeSearchResponse>(cacheKey);
    if (cached) {
      this.logger.debug('Cache hit: anime search', { cacheKey });
      return cached;
    }

    this.logger.info('Fetching anime list from AniList', { variables });

    const data = await this.anilist.query<AnilistSearchData>(
      SEARCH_ANIME_QUERY,
      { ...variables, isAdult: false },
    );

    const result: AnimeSearchResponse = {
      data: data.Page.media.map((m) => ({
        id: m.id,
        title: { romaji: m.title.romaji, english: m.title.english ?? null },
        coverImage: {
          large: m.coverImage.large,
          extraLarge: m.coverImage.extraLarge,
          color: m.coverImage.color ?? null,
        },
        format: m.format ?? null,
        status: m.status ?? null,
        episodes: m.episodes ?? null,
        season: m.season ?? null,
        seasonYear: m.seasonYear ?? null,
        averageScore: m.averageScore ?? null,
      })),
      pageInfo: data.Page.pageInfo,
    };

    await this.cache.set(cacheKey, result, 300); // 5 minutos
    return result;
  }

  // ── Detail ────────────────────────────────────────────────────────

  async getAnimeDetail(id: number): Promise<AnimeDetailResponse> {
    const cacheKey = `anime:detail:${id}`;

    const cached = await this.cache.get<AnimeDetailResponse>(cacheKey);
    if (cached) {
      this.logger.debug('Cache hit: anime detail', { id });
      return cached;
    }

    this.logger.info('Fetching anime detail from AniList', { id });

    // 1. AniList — obligatorio, si falla no podemos continuar
    let anilistData: AnilistDetailData;
    try {
      anilistData = await this.anilist.query<AnilistDetailData>(
        ANIME_DETAIL_QUERY,
        { id, isAdult: false },
      );
    } catch (err: unknown) {
      this.logger.error('AniList detail fetch failed', { id, error: err });
      throw new NotFoundException(`Anime con ID ${id} no encontrado`);
    }

    const media = anilistData.Media;
    const { idMal, title, seasonYear } = media;

    const prequelTitles = media.relations.edges
      .filter(
        (e) =>
          (e.relationType === 'PREQUEL' || e.relationType === 'PARENT') &&
          !e.node.isAdult,
      )
      .map((e) => ({
        romaji: e.node.title.romaji,
        english: e.node.title.english ?? null,
      }));

    this.logger.info(
      'AniList data received, fetching external APIs in parallel',
      {
        id,
        idMal,
        title: title.romaji,
      },
    );

    // 2. APIs externas en paralelo — todas opcionales con fallback
    const [jikanResult, themesResult, tmdbResult] = await Promise.allSettled([
      idMal ? this.fetchJikanData(idMal) : Promise.resolve(null),
      this.fetchAnimeThemesData(
        idMal ?? null,
        title.romaji,
        title.english ?? null,
      ),
      this.fetchTmdbData(
        title.english ?? null,
        title.romaji,
        seasonYear ?? null,
        media.countryOfOrigin ?? null,
        media.format ?? null,
        prequelTitles,
      ),
    ]);

    // Extraer valores o null en caso de fallo
    const jikan = jikanResult.status === 'fulfilled' ? jikanResult.value : null;
    const themes =
      themesResult.status === 'fulfilled' ? themesResult.value : null;
    const tmdb = tmdbResult.status === 'fulfilled' ? tmdbResult.value : null;

    if (jikanResult.status === 'rejected') {
      this.logger.warn('Jikan fetch failed, continuing without it', {
        id,
        error: jikanResult.reason as unknown,
      });
    }
    if (themesResult.status === 'rejected') {
      this.logger.warn('AnimeThemes fetch failed, continuing without it', {
        id,
        error: themesResult.reason as unknown,
      });
    }
    if (tmdbResult.status === 'rejected') {
      this.logger.warn('TMDB fetch failed, continuing without it', {
        id,
        error: tmdbResult.reason as unknown,
      });
    }

    const result = this.buildDetailResponse(media, jikan, themes, tmdb);
    await this.cache.set(cacheKey, result, 3600); // 1 hora
    return result;
  }

  // ── Private: Jikan ────────────────────────────────────────────────

  private async fetchJikanData(malId: number): Promise<JikanBundle> {
    // Las 4 llamadas en paralelo; si alguna falla la reemplazamos por null
    const [news, pictures, reviews, videos] = await Promise.allSettled([
      this.jikan.get<JikanNewsResponse>(`/anime/${malId}/news`),
      this.delay(300).then(() =>
        this.jikan.get<JikanPicturesResponse>(`/anime/${malId}/pictures`),
      ),
      this.delay(600).then(() =>
        this.jikan.get<JikanReviewsResponse>(`/anime/${malId}/reviews`, {
          spoilers: 'false',
        }),
      ),
      this.delay(900).then(() =>
        this.jikan.get<JikanVideosResponse>(`/anime/${malId}/videos`),
      ),
    ]);

    const labels = ['news', 'pictures', 'reviews', 'videos'] as const;
    [news, pictures, reviews, videos].forEach((r, i) => {
      if (r.status === 'rejected') {
        this.logger.warn(`Jikan ${labels[i]} failed`, {
          malId,
          error: r.reason as unknown,
        });
      } else {
        this.logger.debug(`Jikan ${labels[i]} ok`, { malId });
      }
    });

    return {
      news: news.status === 'fulfilled' ? news.value : null,
      pictures: pictures.status === 'fulfilled' ? pictures.value : null,
      reviews: reviews.status === 'fulfilled' ? reviews.value : null,
      videos: videos.status === 'fulfilled' ? videos.value : null,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ── Private: AnimeThemes ──────────────────────────────────────────

  private async fetchAnimeThemesData(
    malId: number | null,
    romajiTitle: string,
    englishTitle: string | null,
  ): Promise<AnimeThemeItem[]> {
    const include = 'animethemes.animethemeentries.videos';

    // Intento 1: por MAL ID — sin ambigüedad posible
    if (malId) {
      try {
        const res = await this.animeThemes.get<AnimeThemesSearchResponse>(
          '/anime',
          {
            filter: {
              has: 'resources',
              site: 'myanimelist',
              external_id: malId,
            },
            include,
          },
        );
        const match = res.anime?.[0];
        if (match?.animethemes?.length)
          return this.mapAnimeThemes(match.animethemes);
        this.logger.debug('AnimeThemes: MAL ID found but no themes', { malId });
      } catch {
        this.logger.debug('AnimeThemes: MAL ID search failed', { malId });
      }
    }

    // Intento 2: slug del título en Romaji (fallback si no hay MAL ID)
    const romajiSlug = this.toSlug(romajiTitle);
    try {
      const res = await this.animeThemes.get<AnimeThemesAnimeResponse>(
        `/anime/${romajiSlug}`,
        { include },
      );
      const themes = res.anime?.animethemes;
      if (themes?.length) return this.mapAnimeThemes(themes);
    } catch {
      this.logger.debug('AnimeThemes: romaji slug not found', { romajiSlug });
    }

    // Intento 3: slug del título en inglés
    if (englishTitle) {
      const englishSlug = this.toSlug(englishTitle);
      try {
        const res = await this.animeThemes.get<AnimeThemesAnimeResponse>(
          `/anime/${englishSlug}`,
          { include },
        );
        const themes = res.anime?.animethemes;
        if (themes?.length) return this.mapAnimeThemes(themes);
      } catch {
        this.logger.debug('AnimeThemes: english slug not found', {
          englishSlug,
        });
      }
    }

    return [];
  }

  // ── Private: TMDB ─────────────────────────────────────────────────

  private async fetchTmdbData(
    englishTitle: string | null,
    romajiTitle: string,
    seasonYear: number | null,
    countryOfOrigin: string | null,
    format: string | null,
    prequelTitles: Array<{ romaji: string; english: string | null }>,
  ): Promise<TmdbBundle | null> {
    const isMovie = format === 'MOVIE';

    const entry = await this.findTmdbEntry(
      englishTitle,
      romajiTitle,
      seasonYear,
      countryOfOrigin,
      isMovie,
      prequelTitles,
    );
    if (!entry) return null;

    const basePath =
      entry.mediaType === 'movie' ? `/movie/${entry.id}` : `/tv/${entry.id}`;

    const [images, detail] = await Promise.allSettled([
      this.tmdb.get<TmdbImagesResponse>(`${basePath}/images`),
      this.tmdb.get<TmdbTvDetail>(basePath, { language: 'es-ES' }),
    ]);

    return {
      images: images.status === 'fulfilled' ? images.value : null,
      detail: detail.status === 'fulfilled' ? detail.value : null,
    };
  }

  private async findTmdbEntry(
    englishTitle: string | null,
    romajiTitle: string,
    year: number | null,
    countryOfOrigin: string | null,
    isMovie: boolean,
    prequelTitles: Array<{ romaji: string; english: string | null }>,
  ): Promise<{ id: number; mediaType: 'tv' | 'movie' } | null> {
    const mediaType = isMovie ? 'movie' : 'tv';
    const endpoint = isMovie ? '/search/movie' : '/search/tv';

    // Intento 1 y 2: títulos propios del anime
    const primaryTitles = [englishTitle, romajiTitle].filter(
      Boolean,
    ) as string[];
    for (const title of primaryTitles) {
      const id = await this.searchTmdbTitle(
        title,
        year,
        countryOfOrigin,
        romajiTitle,
        englishTitle,
        isMovie,
        endpoint,
      );
      if (id) {
        this.logger.info('TMDB match found', { title, tmdbId: id, mediaType });
        return { id, mediaType };
      }
    }

    // Fallback: títulos de precuela/padre — sin restricción de año
    if (prequelTitles.length) {
      this.logger.debug('TMDB: trying prequel/parent titles', {
        prequelTitles,
      });
      const fallback = prequelTitles.flatMap(
        (t) => [t.english, t.romaji].filter(Boolean) as string[],
      );
      for (const title of fallback) {
        const id = await this.searchTmdbTitle(
          title,
          null,
          countryOfOrigin,
          title,
          null,
          isMovie,
          endpoint,
        );
        if (id) {
          this.logger.info('TMDB: found via prequel/parent', {
            title,
            tmdbId: id,
          });
          return { id, mediaType };
        }
      }
    }

    this.logger.warn('TMDB: no entry found', {
      englishTitle,
      romajiTitle,
      year,
    });
    return null;
  }

  // ── Private: Build response ───────────────────────────────────────

  private buildDetailResponse(
    media: AnilistMediaDetail,
    jikan: JikanBundle | null,
    themes: AnimeThemeItem[] | null,
    tmdb: TmdbBundle | null,
  ): AnimeDetailResponse {
    // Tags sin spoilers
    const tags = media.tags
      .filter((t) => !t.isGeneralSpoiler && !t.isMediaSpoiler && !t.isAdult)
      .map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        category: t.category,
        rank: t.rank,
      }));

    // Relaciones sin adult
    const relations: AnimeRelation[] = media.relations.edges
      .filter((e) => !e.node.isAdult)
      .map((e) => ({
        id: e.node.id,
        title: {
          romaji: e.node.title.romaji,
          english: e.node.title.english ?? null,
        },
        coverImage: e.node.coverImage.large,
        format: e.node.format ?? null,
        status: e.node.status ?? null,
        relationType: e.relationType,
        type: e.node.type,
      }));

    // Personajes — AniList ya los devuelve ordenados: MAIN primero
    const characters: AnimeCharacter[] = media.characters.edges.map((e) => ({
      id: e.node.id,
      name: e.node.name.full,
      image: e.node.image.large,
      role: e.role,
    }));

    // Recomendaciones sin adult
    const recommendations: AnimeRecommendation[] = media.recommendations.nodes
      .filter((n) => n.mediaRecommendation && !n.mediaRecommendation.isAdult)
      .map((n) => ({
        id: n.mediaRecommendation!.id,
        title: {
          romaji: n.mediaRecommendation!.title.romaji,
          english: n.mediaRecommendation!.title.english ?? null,
        },
        coverImage: n.mediaRecommendation!.coverImage.large,
        format: n.mediaRecommendation!.format ?? null,
        averageScore: n.mediaRecommendation!.averageScore ?? null,
        type: n.mediaRecommendation!.type,
      }));

    // Jikan: noticias
    const news: AnimeNewsItem[] | null =
      jikan?.news?.data?.slice(0, 10)?.map((n) => ({
        malId: n.mal_id,
        title: n.title,
        url: n.url,
        imageUrl: n.images?.jpg?.image_url ?? null,
        date: n.date,
        authorUsername: n.author_username,
        intro: n.intro,
      })) ?? null;

    // Jikan: imágenes extra
    const pictures: AnimePicture[] | null =
      jikan?.pictures?.data?.map((p) => ({
        jpg: p.jpg.large_image_url ?? p.jpg.image_url ?? '',
        webp: p.webp?.large_image_url ?? p.webp?.image_url ?? null,
      })) ?? null;

    // Jikan: reseñas (filtramos spoilers)
    const reviews: AnimeReview[] | null =
      jikan?.reviews?.data
        ?.filter((r) => !r.is_spoiler)
        ?.slice(0, 10)
        ?.map((r) => ({
          malId: r.mal_id,
          url: r.url,
          date: r.date,
          review: r.review,
          score: r.score,
          tags: r.tags,
          episodesWatched: r.episodes_watched ?? null,
          user: {
            username: r.user.username,
            url: r.user.url,
            imageUrl: r.user.images?.jpg?.image_url ?? null,
          },
        })) ?? null;

    // Jikan: vídeos promocionales
    const promoVideos: AnimePromoVideo[] | null = (() => {
      // Extrae el ID de cualquier forma en que YouTube lo proporcione,
      // priorizando embed_url porque es el único campo que Jikan rellena
      const extractYoutubeId = (
        str: string | null | undefined,
      ): string | null => {
        if (!str) return null;
        // /embed/VIDEO_ID?...
        const embed = str.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
        if (embed) return embed[1];
        // ?v=VIDEO_ID o youtu.be/VIDEO_ID
        const watch = str.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (watch) return watch[1];
        // ID desnudo de 11 caracteres
        if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
        return null;
      };

      const promo: AnimePromoVideo[] =
        jikan?.videos?.data?.promo
          ?.map((v) => {
            const youtubeId =
              extractYoutubeId(v.trailer.youtube_id) ??
              extractYoutubeId(v.trailer.embed_url) ??
              extractYoutubeId(v.trailer.url);
            if (!youtubeId) return null;
            return {
              title: v.title || 'Trailer',
              youtubeId,
              url: `https://www.youtube.com/watch?v=${youtubeId}`,
              thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
            };
          })
          .filter((v): v is AnimePromoVideo => v !== null) ?? [];

      const all = [...promo];
      return all.length ? all : null;
    })();

    // Posters: máx. 50
    const posters: string[] | null =
      tmdb?.images?.posters
        ?.filter((p) => p.iso_639_1 === 'en' || p.iso_639_1 === null)
        ?.slice(0, 40)
        ?.map((p) => `${this.TMDB_IMAGE_BASE}${p.file_path}`) ?? null;

    // Backdrops: máx. 50
    const backdrops: string[] | null =
      tmdb?.images?.backdrops
        ?.slice(0, 20)
        ?.map((b) => `${this.TMDB_IMAGE_BASE}${b.file_path}`) ?? null;

    // TMDB: sinopsis en español
    const descriptionEs: string | null = tmdb?.detail?.overview || null;

    return {
      id: media.id,
      idMal: media.idMal ?? null,
      title: {
        romaji: media.title.romaji,
        english: media.title.english ?? null,
        native: media.title.native ?? null,
      },
      coverImage: {
        large: media.coverImage.large,
        extraLarge: media.coverImage.extraLarge,
        color: media.coverImage.color ?? null,
      },
      bannerImage: media.bannerImage ?? null,
      format: media.format ?? null,
      status: media.status ?? null,
      episodes: media.episodes ?? null,
      duration: media.duration ?? null,
      source: media.source ?? null,
      season: media.season ?? null,
      seasonYear: media.seasonYear ?? null,
      startDate: media.startDate,
      endDate: media.endDate,
      countryOfOrigin: media.countryOfOrigin ?? null,
      averageScore: media.averageScore ?? null,
      meanScore: media.meanScore ?? null,
      popularity: media.popularity ?? null,
      favourites: media.favourites ?? null,
      genres: media.genres,
      tags,
      description: media.description ?? null,
      studios: media.studios.nodes.map((s) => ({ id: s.id, name: s.name })),
      trailer: media.trailer
        ? {
            id: media.trailer.id,
            site: media.trailer.site,
            thumbnail: media.trailer.thumbnail,
          }
        : null,
      relations,
      characters,
      recommendations,
      externalLinks: media.externalLinks,
      // Datos externos (nullable)
      news: news?.length ? news : null,
      pictures: pictures?.length ? pictures : null,
      reviews: reviews?.length ? reviews : null,
      promoVideos: promoVideos?.length ? promoVideos : null,
      themes: themes?.length ? themes : null,
      descriptionEs,
      posters: posters?.length ? posters : null,
      backdrops: backdrops?.length ? backdrops : null,
    };
  }

  // ── Private: Helpers ──────────────────────────────────────────────

  private resolveSearchVariables(dto: SearchAnimeDto): Record<string, unknown> {
    const {
      query,
      quickFilter,
      sort,
      season,
      seasonYear,
      formats,
      statuses,
      genres,
      page,
      perPage,
    } = dto;

    // Valores por defecto del quickFilter
    let resolvedSorts: string[] = query
      ? [AnimeSort.POPULARITY_DESC]
      : [AnimeSort.TRENDING_DESC];
    let resolvedSeason: string | undefined;
    let resolvedSeasonYear: number | undefined;
    let resolvedStatuses: string[] | undefined;

    if (quickFilter) {
      switch (quickFilter) {
        case QuickFilter.TOP_ANIME:
          resolvedSorts = [AnimeSort.SCORE_DESC];
          break;
        case QuickFilter.CURRENT_SEASON: {
          const current = this.getCurrentSeason();
          resolvedSeason = current.season;
          resolvedSeasonYear = current.year;
          resolvedSorts = [AnimeSort.POPULARITY_DESC];
          break;
        }
        case QuickFilter.TOP_AIRING:
          resolvedStatuses = ['RELEASING'];
          resolvedSorts = [AnimeSort.SCORE_DESC];
          break;
        case QuickFilter.TOP_UPCOMING:
          resolvedStatuses = ['NOT_YET_RELEASED'];
          resolvedSorts = [AnimeSort.POPULARITY_DESC];
          break;
        default:
          resolvedSorts = [AnimeSort.TRENDING_DESC];
      }
    }

    // Los filtros del usuario siempre sobreescriben el quickFilter
    if (sort) resolvedSorts = [sort];
    if (season) resolvedSeason = season;
    if (seasonYear) resolvedSeasonYear = seasonYear;
    if (statuses?.length) resolvedStatuses = statuses;

    return {
      page: page ?? 1,
      perPage: perPage ?? 20,
      ...(query ? { search: query } : {}),
      sort: resolvedSorts,
      ...(resolvedSeason ? { season: resolvedSeason } : {}),
      ...(resolvedSeasonYear ? { seasonYear: resolvedSeasonYear } : {}),
      ...(formats?.length ? { format_in: formats } : {}),
      ...(resolvedStatuses?.length ? { status_in: resolvedStatuses } : {}),
      ...(genres?.length ? { genre_in: genres } : {}),
    };
  }

  private getCurrentSeason(): { season: AnimeSeason; year: number } {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    let season: AnimeSeason;
    if (month <= 3) season = AnimeSeason.WINTER;
    else if (month <= 6) season = AnimeSeason.SPRING;
    else if (month <= 9) season = AnimeSeason.SUMMER;
    else season = AnimeSeason.FALL;
    return { season, year };
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

  private toSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private mapAnimeThemes(themes: AnimeTheme[]): AnimeThemeItem[] {
    return themes.map((t) => ({
      slug: t.slug,
      type: t.type,
      videoUrl: t.animethemeentries[0]?.videos[0]?.link ?? null,
      spoiler: t.animethemeentries[0]?.spoiler ?? false,
    }));
  }

  private async searchTmdbTitle(
    title: string,
    year: number | null,
    countryOfOrigin: string | null,
    romajiTitle: string,
    englishTitle: string | null,
    isMovie: boolean,
    endpoint: string,
  ): Promise<number | null> {
    try {
      const params: Record<string, unknown> = {
        query: title,
        language: 'es-ES',
      };
      if (year)
        params[isMovie ? 'primary_release_year' : 'first_air_date_year'] = year;

      if (isMovie) {
        const res = await this.tmdb.get<TmdbMovieSearchResponse>(
          endpoint,
          params,
        );
        this.logger.info('TMDB movie search', {
          title,
          total: res.results.length,
        });
        return (
          this.findBestTmdbMovieMatch(
            res.results,
            year,
            romajiTitle,
            englishTitle,
          )?.id ?? null
        );
      } else {
        const res = await this.tmdb.get<TmdbSearchResponse>(endpoint, params);
        this.logger.info('TMDB search', { title, total: res.results.length });
        return (
          this.findBestTmdbMatch(
            res.results,
            year,
            romajiTitle,
            englishTitle,
            countryOfOrigin,
          )?.id ?? null
        );
      }
    } catch (err) {
      this.logger.warn('TMDB search failed', { title, error: err as unknown });
      return null;
    }
  }

  private findBestTmdbMovieMatch(
    results: TmdbMovieSearchResult[],
    year: number | null,
    romajiTitle: string,
    englishTitle: string | null,
  ): TmdbMovieSearchResult | null {
    if (!results.length) return null;
    const ANIMATION_GENRE_ID = 16;

    const scored = results.map((r) => {
      let score = 0;

      if (r.genre_ids?.includes(ANIMATION_GENRE_ID)) score += 3;
      else score -= 10;

      if (r.original_language === 'ja') score += 2;

      if (year && r.release_date) {
        const releaseYear = new Date(r.release_date).getFullYear();
        if (releaseYear === year) score += 4;
        else if (Math.abs(releaseYear - year) <= 1) score += 1;
        else score -= 5;
      }

      const name = r.title?.toLowerCase() ?? '';
      const romaji = romajiTitle.toLowerCase();
      const english = englishTitle?.toLowerCase() ?? '';
      if (name === romaji || name === english) score += 4;
      else if (name.includes(romaji) || romaji.includes(name)) score += 2;
      else if (english && (name.includes(english) || english.includes(name)))
        score += 2;
      else score -= 3;

      return { result: r, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];
    if (best.score < 0) {
      this.logger.debug('TMDB movie: low score, rejecting', {
        title: best.result.title,
        score: best.score,
      });
      return null;
    }
    return best.result;
  }

  private findBestTmdbMatch(
    results: TmdbSearchResult[],
    year: number | null,
    romajiTitle: string,
    englishTitle: string | null,
    countryOfOrigin: string | null,
  ): TmdbSearchResult | null {
    if (!results.length) return null;

    const ANIMATION_GENRE_ID = 16;

    const scored = results.map((r) => {
      let score = 0;

      // Solo contenido de animación
      if (r.genre_ids?.includes(ANIMATION_GENRE_ID)) score += 3;
      else score -= 10; // penalización fuerte si no es animación

      // País de origen
      if (countryOfOrigin && r.origin_country?.includes(countryOfOrigin))
        score += 2;

      // Año de emisión (tolerancia ±1)
      if (year && r.first_air_date) {
        const airYear = new Date(r.first_air_date).getFullYear();
        if (airYear === year) score += 4;
        else if (airYear === year - 1 || airYear === year + 1) score += 1;
        else score -= 5;
      }

      // Similitud de título
      const name = r.name?.toLowerCase() ?? '';
      const romaji = romajiTitle.toLowerCase();
      const english = englishTitle?.toLowerCase() ?? '';
      if (name === romaji || name === english) score += 4;
      else if (name.includes(romaji) || romaji.includes(name)) score += 2;
      else if (english && (name.includes(english) || english.includes(name)))
        score += 2;
      else score -= 3;

      return { result: r, score };
    });

    scored.sort((a, b) => b.score - a.score);

    const best = scored[0];
    if (best.score < 0) {
      this.logger.debug('TMDB: best match scored too low, rejecting', {
        title: best.result.name,
        score: best.score,
      });
      return null;
    }

    return best.result;
  }
}
