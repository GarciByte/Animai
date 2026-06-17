import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CharacterService } from './character.service';
import { SearchCharacterDto } from './dto/search-character.dto';

@ApiTags('characters')
@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get()
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 req/min por IP
  @ApiOperation({
    summary: 'Buscar y listar personajes ordenados por popularidad',
  })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Búsqueda por nombre',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista paginada de personajes' })
  searchCharacters(@Query() dto: SearchCharacterDto) {
    return this.characterService.searchCharacters(dto);
  }

  @Get(':id')
  @Throttle({ default: { limit: 15, ttl: 60000 } }) // 15 req/min por IP
  @ApiOperation({ summary: 'Obtener detalle completo de un personaje' })
  @ApiParam({ name: 'id', type: Number, description: 'AniList character ID' })
  @ApiResponse({ status: 200, description: 'Detalle completo del personaje' })
  @ApiResponse({ status: 404, description: 'Personaje no encontrado' })
  getCharacterDetail(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.getCharacterDetail(id);
  }
}
