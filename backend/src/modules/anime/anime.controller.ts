import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AnimeService } from './anime.service';
import {
  AnimeFormat,
  AnimeSeason,
  AnimeSort,
  AnimeStatus,
  QuickFilter,
  SearchAnimeDto,
} from './dto/search-anime.dto';

@ApiTags('anime')
@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @Get()
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @ApiOperation({ summary: 'Buscar y listar animes con filtros' })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Búsqueda por nombre',
  })
  @ApiQuery({
    name: 'quickFilter',
    required: false,
    enum: QuickFilter,
    description: 'Vista rápida (Trending, Top Anime, Current Season…)',
  })
  @ApiQuery({ name: 'sort', required: false, enum: AnimeSort })
  @ApiQuery({ name: 'season', required: false, enum: AnimeSeason })
  @ApiQuery({ name: 'seasonYear', required: false, type: Number })
  @ApiQuery({
    name: 'formats',
    required: false,
    enum: AnimeFormat,
    isArray: true,
    description: 'Puede repetirse: ?formats=TV&formats=MOVIE',
  })
  @ApiQuery({
    name: 'statuses',
    required: false,
    enum: AnimeStatus,
    isArray: true,
  })
  @ApiQuery({
    name: 'genres',
    required: false,
    isArray: true,
    type: String,
    description: 'Puede repetirse: ?genres=Action&genres=Drama',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista paginada de animes' })
  searchAnime(@Query() dto: SearchAnimeDto) {
    return this.animeService.searchAnime(dto);
  }

  @Get(':id')
  @Throttle({ default: { limit: 40, ttl: 60000 } })
  @ApiOperation({ summary: 'Obtener detalle completo de un anime' })
  @ApiParam({ name: 'id', type: Number, description: 'AniList media ID' })
  @ApiResponse({
    status: 200,
    description: 'Detalle completo del anime con datos de APIs externas',
  })
  @ApiResponse({ status: 404, description: 'Anime no encontrado' })
  getAnimeDetail(@Param('id', ParseIntPipe) id: number) {
    return this.animeService.getAnimeDetail(id);
  }
}
