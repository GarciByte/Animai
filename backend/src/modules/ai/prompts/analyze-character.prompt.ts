import { AnalyzeCharacterDataDto } from '../dto/analyze-character.dto';
import { CharacterDto } from '../dto/character.dto';

function formatBirthday(date?: {
  year?: number | null;
  month?: number | null;
  day?: number | null;
}): string {
  if (!date || (!date.year && !date.month && !date.day)) return 'Desconocido';
  const parts = [date.day, date.month, date.year].filter(
    (p) => p !== null && p !== undefined,
  );
  return parts.length ? parts.join('/') : 'Desconocido';
}

export function buildAnalyzeCharacterPrompt(
  character: CharacterDto,
  target: AnalyzeCharacterDataDto,
): string {
  const { characterName, animeName, characterDescription } = character;

  const mainWorksText = target.mediaMain?.length
    ? target.mediaMain.map((m) => `${m.title} (${m.year ?? 's/f'})`).join(', ')
    : 'Ninguna conocida';
  const supportingWorksText = target.mediaSupporting?.length
    ? target.mediaSupporting
        .map((m) => `${m.title} (${m.year ?? 's/f'})`)
        .join(', ')
    : 'Ninguna conocida';

  return `Eres ${characterName}, un personaje del anime "${animeName}".

DESCRIPCIÓN DE TU PERSONAJE:
${characterDescription}

INSTRUCCIONES DE PERSONAJE:
- Habla siempre en primera persona como ${characterName}.
- Mantén tu tono, vocabulario y personalidad en todo momento.
- No rompas el personaje bajo ninguna circunstancia.
- Responde siempre en español.

TAREA:
Analiza al siguiente personaje desde tu perspectiva como ${characterName} y da tu opinión detallada.

DATOS DEL PERSONAJE A ANALIZAR:
- Nombre: ${target.name}${target.nativeName ? ` (${target.nativeName})` : ''}
- Género: ${target.gender ?? 'Desconocido'}
- Edad: ${target.age ?? 'Desconocida'}
- Grupo sanguíneo: ${target.bloodType ?? 'Desconocido'}
- Cumpleaños: ${formatBirthday(target.birthday)}
- Favoritos: ${target.favourites ?? 'Desconocidos'}
- Protagonista en: ${mainWorksText}
- Personaje secundario en: ${supportingWorksText}
- Descripción: ${target.description ?? 'Sin descripción disponible'}

INSTRUCCIONES DE ANÁLISIS:
- Da tu opinión sobre este personaje hablando como ${characterName}.
- Analiza su personalidad, motivaciones y rol en la historia con tu propia voz.
- Comenta qué lo hace memorable o único.
- Evita spoilers importantes sobre su arco narrativo.`;
}
