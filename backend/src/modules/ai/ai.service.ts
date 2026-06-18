import { Inject, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CacheService } from '../../common/cache/cache.service';
import {
  ChatMessage,
  OpenRouterClient,
} from '../../common/http/openrouter/openrouter.client';
import { AnalyzeAnimeDto } from './dto/analyze-anime.dto';
import { AnalyzeCharacterDto } from './dto/analyze-character.dto';
import { ChatDto } from './dto/chat.dto';
import { TranslateDto } from './dto/translate.dto';
import { buildAnalyzeAnimePrompt } from './prompts/analyze-anime.prompt';
import { buildAnalyzeCharacterPrompt } from './prompts/analyze-character.prompt';
import { buildChatPrompt } from './prompts/chat.prompt';
import { buildTranslatePrompt } from './prompts/translate.prompt';

@Injectable()
export class AiService {
  constructor(
    private readonly openRouter: OpenRouterClient,
    private readonly cache: CacheService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  // ── Chat ──────────────────────────────────────────────────────────
  // Sin caché: cada conversación es única, cachearla no tendría sentido.

  async chat(dto: ChatDto): Promise<{ reply: string }> {
    this.logger.info('AI chat request', {
      character: dto.character.characterName,
      historyLength: dto.messages.length,
    });

    const systemPrompt = buildChatPrompt(dto.character);
    const reply = await this.openRouter.chat(dto.messages, systemPrompt);

    return { reply };
  }

  // ── Analyze anime ─────────────────────────────────────────────────
  // Con caché: mismo anime + mismo personaje → misma opinión durante 1 hora,
  // evita gastar cuota de OpenRouter si el usuario revisita la misma ficha.

  async analyzeAnime(dto: AnalyzeAnimeDto): Promise<{ analysis: string }> {
    const cacheKey = `ai:analyze:anime:${dto.anime.id}:${this.hashPayload(dto.character)}`;

    const cached = await this.cache.get<{ analysis: string }>(cacheKey);
    if (cached) {
      this.logger.debug('Cache hit: anime analysis', { animeId: dto.anime.id });
      return cached;
    }

    this.logger.info('AI anime analysis request', {
      animeId: dto.anime.id,
      character: dto.character.characterName,
    });

    const systemPrompt = buildAnalyzeAnimePrompt(dto.character, dto.anime);
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: `¿Qué opinas sobre el anime "${dto.anime.title.romaji}"?`,
      },
    ];

    const analysis = await this.openRouter.chat(messages, systemPrompt);
    const result = { analysis };

    await this.cache.set(cacheKey, result, 3600); // 1 hora
    return result;
  }

  // ── Analyze character ─────────────────────────────────────────────

  async analyzeCharacter(
    dto: AnalyzeCharacterDto,
  ): Promise<{ analysis: string }> {
    const cacheKey = `ai:analyze:character:${dto.targetCharacter.id}:${this.hashPayload(dto.character)}`;

    const cached = await this.cache.get<{ analysis: string }>(cacheKey);
    if (cached) {
      this.logger.debug('Cache hit: character analysis', {
        targetId: dto.targetCharacter.id,
      });
      return cached;
    }

    this.logger.info('AI character analysis request', {
      targetId: dto.targetCharacter.id,
      character: dto.character.characterName,
    });

    const systemPrompt = buildAnalyzeCharacterPrompt(
      dto.character,
      dto.targetCharacter,
    );
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: `¿Qué opinas sobre el personaje ${dto.targetCharacter.name}?`,
      },
    ];

    const analysis = await this.openRouter.chat(messages, systemPrompt);
    const result = { analysis };

    await this.cache.set(cacheKey, result, 3600); // 1 hora
    return result;
  }

  // ── Translate ─────────────────────────────────────────────────────
  // Con caché larga (24h): el mismo texto con el mismo contexto siempre
  // debería traducirse igual, así que es el endpoint que más se beneficia
  // de cachear.

  async translate(dto: TranslateDto): Promise<{ translatedText: string }> {
    const cacheKey = `ai:translate:${this.hashPayload(dto)}`;

    const cached = await this.cache.get<{ translatedText: string }>(cacheKey);
    if (cached) {
      this.logger.debug('Cache hit: translation');
      return cached;
    }

    this.logger.info('AI translation request', {
      context: dto.context ?? 'GENERIC',
      textLength: dto.text.length,
    });

    const systemPrompt = buildTranslatePrompt({
      context: dto.context,
      animeContext: dto.animeContext,
      characterContext: dto.characterContext,
    });

    const messages: ChatMessage[] = [{ role: 'user', content: dto.text }];
    const rawTranslation = await this.openRouter.chat(messages, systemPrompt);
    const result = { translatedText: rawTranslation.trim() };

    await this.cache.set(cacheKey, result, 86400); // 24 horas
    return result;
  }

  // ── Private: Helpers ──────────────────────────────────────────────

  private hashPayload(payload: unknown): string {
    return createHash('sha1').update(JSON.stringify(payload)).digest('hex');
  }
}
