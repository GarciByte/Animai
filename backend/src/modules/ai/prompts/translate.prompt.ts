import {
  TranslateAnimeContextDto,
  TranslateCharacterContextDto,
  TranslationContext,
} from '../dto/translate.dto';

export interface TranslatePromptParams {
  context?: TranslationContext;
  animeContext?: TranslateAnimeContextDto;
  characterContext?: TranslateCharacterContextDto;
}

export function buildTranslatePrompt(params: TranslatePromptParams): string {
  let contextBlock = '';

  if (params.animeContext) {
    const { title, genres, format, tags } = params.animeContext;
    contextBlock = `

CONTEXTO ADICIONAL (este texto pertenece a un anime, úsalo para traducir con la terminología correcta):
- Título: ${title}
- Formato: ${format ?? 'Desconocido'}
- Géneros: ${genres?.length ? genres.join(', ') : 'Desconocidos'}
- Tags: ${tags?.length ? tags.join(', ') : 'Sin tags'}`;
  } else if (params.characterContext) {
    const { name, animeName, gender, age } = params.characterContext;
    contextBlock = `

CONTEXTO ADICIONAL (este texto describe a un personaje de anime, úsalo para traducir con precisión):
- Nombre del personaje: ${name}
- Anime: ${animeName ?? 'Desconocido'}
- Género: ${gender ?? 'Desconocido'}
- Edad: ${age ?? 'Desconocida'}`;
  }

  return `Eres un traductor profesional especializado en anime, manga y cultura japonesa.

TAREA:
Traduce el siguiente texto del inglés al español de forma natural, fluida y precisa.${contextBlock}

REGLAS ESTRICTAS (cúmplelas siempre):
- Devuelve ÚNICAMENTE el texto traducido, nada más.
- No añadas comentarios, explicaciones, notas, ni introducciones como "Aquí está la traducción:".
- No incluyas comillas envolviendo el resultado.
- Conserva los nombres propios de personajes, lugares y técnicas, salvo que tengan una traducción oficial ampliamente conocida.
- Conserva el formato original (saltos de línea, listas, puntuación de párrafos).
- Si el texto ya está en español, devuélvelo exactamente igual sin modificarlo.`;
}
