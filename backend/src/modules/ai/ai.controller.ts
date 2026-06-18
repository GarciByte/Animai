import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AiService } from './ai.service';
import { AnalyzeAnimeDto } from './dto/analyze-anime.dto';
import { AnalyzeCharacterDto } from './dto/analyze-character.dto';
import { ChatDto } from './dto/chat.dto';
import { TranslateDto } from './dto/translate.dto';

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @Throttle({ default: { limit: 15, ttl: 60000 } }) // 15 mensajes/min por IP
  @ApiOperation({
    summary: 'Hablar con la IA interpretando un personaje de anime',
  })
  @ApiBody({ type: ChatDto })
  @ApiResponse({
    status: 200,
    description: 'Respuesta de la IA en el papel del personaje',
  })
  chat(@Body() dto: ChatDto) {
    return this.aiService.chat(dto);
  }

  @Post('analyze/anime')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 análisis/min por IP
  @ApiOperation({
    summary:
      'La IA analiza un anime y da su opinión interpretando un personaje',
  })
  @ApiBody({ type: AnalyzeAnimeDto })
  @ApiResponse({
    status: 200,
    description: 'Análisis del anime en el papel del personaje',
  })
  analyzeAnime(@Body() dto: AnalyzeAnimeDto) {
    return this.aiService.analyzeAnime(dto);
  }

  @Post('analyze/character')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 análisis/min por IP
  @ApiOperation({
    summary:
      'La IA analiza un personaje y da su opinión interpretando otro personaje',
  })
  @ApiBody({ type: AnalyzeCharacterDto })
  @ApiResponse({
    status: 200,
    description: 'Análisis del personaje en el papel del personaje asignado',
  })
  analyzeCharacter(@Body() dto: AnalyzeCharacterDto) {
    return this.aiService.analyzeCharacter(dto);
  }

  @Post('translate')
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 traducciones/min por IP
  @ApiOperation({
    summary:
      'Traduce un texto del inglés al español con contexto adicional opcional',
  })
  @ApiBody({ type: TranslateDto })
  @ApiResponse({
    status: 200,
    description: 'Texto traducido, sin comentarios adicionales',
  })
  translate(@Body() dto: TranslateDto) {
    return this.aiService.translate(dto);
  }
}
