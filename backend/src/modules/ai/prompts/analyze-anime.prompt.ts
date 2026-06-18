import { AnalyzeAnimeDataDto } from '../dto/analyze-anime.dto';
import { CharacterDto } from '../dto/character.dto';

function formatDate(date?: {
  year?: number | null;
  month?: number | null;
  day?: number | null;
}): string {
  if (!date || (!date.year && !date.month && !date.day)) return 'Desconocida';
  const parts = [date.day, date.month, date.year].filter(
    (p) => p !== null && p !== undefined,
  );
  return parts.length ? parts.join('/') : 'Desconocida';
}

export function buildAnalyzeAnimePrompt(
  character: CharacterDto,
  anime: AnalyzeAnimeDataDto,
): string {
  const { characterName, animeName, characterDescription } = character;

  const genresText = anime.genres?.length
    ? anime.genres.join(', ')
    : 'Desconocidos';
  const tagsText = anime.tags?.length
    ? anime.tags.map((t) => t.name).join(', ')
    : 'Sin tags';
  const studiosText = anime.studios?.length
    ? anime.studios.map((s) => s.name).join(', ')
    : 'Desconocido';
  const charactersText = anime.characters?.length
    ? anime.characters.map((c) => `${c.name} (${c.role})`).join(', ')
    : 'Desconocidos';
  const relationsText = anime.relations?.length
    ? anime.relations.map((r) => `${r.title} (${r.relationType})`).join(', ')
    : 'Sin relaciones conocidas';

  return `Eres ${characterName}, un personaje del anime "${animeName}".

DESCRIPCIÓN DE TU PERSONAJE:
${characterDescription}

INSTRUCCIONES DE PERSONAJE:
- Habla siempre en primera persona como ${characterName}.
- Mantén tu tono, vocabulario y personalidad en todo momento.
- No rompas el personaje bajo ninguna circunstancia.
- Responde siempre en español.

TAREA:
Analiza el siguiente anime desde tu perspectiva como ${characterName} y da tu opinión detallada.

DATOS DEL ANIME A ANALIZAR:
- Título: ${anime.title.romaji}${anime.title.english ? ` (${anime.title.english})` : ''}
- Formato: ${anime.format ?? 'Desconocido'}
- Estado: ${anime.status ?? 'Desconocido'}
- Episodios: ${anime.episodes ?? 'Desconocido'}
- Duración por episodio: ${anime.duration ? `${anime.duration} min` : 'Desconocida'}
- Fuente: ${anime.source ?? 'Desconocida'}
- Temporada: ${anime.season ?? 'Desconocida'} ${anime.seasonYear ?? ''}
- Emisión: ${formatDate(anime.startDate)} - ${formatDate(anime.endDate)}
- País de origen: ${anime.countryOfOrigin ?? 'Desconocido'}
- Puntuación media: ${anime.averageScore ?? 'Sin puntuación'}
- Popularidad: ${anime.popularity ?? 'Desconocida'}
- Favoritos: ${anime.favourites ?? 'Desconocidos'}
- Géneros: ${genresText}
- Tags: ${tagsText}
- Estudios: ${studiosText}
- Personajes destacados: ${charactersText}
- Relacionado con: ${relationsText}
- Sinopsis: ${anime.description ?? 'Sin sinopsis disponible'}

INSTRUCCIONES DE ANÁLISIS:
- Da tu opinión honesta sobre el anime hablando como ${characterName}.
- Comenta sus puntos fuertes y débiles con la personalidad de tu personaje.
- Indica a qué tipo de espectador se lo recomendarías.
- Evita spoilers importantes de la trama.`;
}
