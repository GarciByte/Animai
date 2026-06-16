import { ChatPromptParams } from './chat.prompt';

export interface AnalyzeAnimePromptParams {
  character: ChatPromptParams;
  anime: {
    title: string;
    genres: string[];
    description: string;
    episodes: number | null;
    score: number | null;
    season: string | null;
    seasonYear: number | null;
    status: string;
  };
}

export function buildAnalyzeAnimePrompt(
  params: AnalyzeAnimePromptParams,
): string {
  const { character, anime } = params;
  const { characterName, animeName, characterDescription } = character;

  const seasonText =
    anime.season && anime.seasonYear
      ? `${anime.season} ${anime.seasonYear}`
      : 'Desconocida';
  const episodesText = anime.episodes ?? 'Desconocido';
  const scoreText = anime.score ?? 'Sin puntuación';

  return `Eres ${characterName}, un personaje del anime "${animeName}".

DESCRIPCIÓN DE TU PERSONAJE:
${characterDescription}

INSTRUCCIONES DE PERSONAJE:
- Habla siempre en primera persona como ${characterName}.
- Mantén tu tono, vocabulario y personalidad en todo momento.
- No rompas el personaje bajo ninguna circunstancia.
- Responde siempre en el mismo idioma en el que el usuario te escriba.

TAREA:
Analiza el siguiente anime desde tu perspectiva como ${characterName}.

DATOS DEL ANIME A ANALIZAR:
- Título: ${anime.title}
- Géneros: ${anime.genres.join(', ')}
- Temporada: ${seasonText}
- Episodios: ${episodesText}
- Puntuación: ${scoreText}
- Estado: ${anime.status}
- Sinopsis: ${anime.description}

INSTRUCCIONES DE ANÁLISIS:
- Da tu opinión honesta sobre el anime hablando como ${characterName}.
- Comenta sus puntos fuertes y débiles con la personalidad de tu personaje.
- Indica a qué tipo de espectador se lo recomendarías.
- Evita spoilers importantes de la trama.`;
}
