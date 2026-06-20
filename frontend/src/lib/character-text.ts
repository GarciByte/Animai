// Utilidades para limpiar el texto de descripción de personajes

export function stripHtml(text: string): string {
  return text.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "");
}

// Elimina líneas completas tipo "__Etiqueta:__ valor" — son datos
// sueltos que algunos editores añaden dentro de la propia descripción,
// no forman parte de la narrativa del personaje.
export function stripStatBlocks(text: string): string {
  return text
    .split("\n")
    .filter((line) => !/^\s*(?:__[^_]+:?__:?|\*\*[^*]+:\*\*)/.test(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function cleanDescription(raw: string): string {
  return stripStatBlocks(stripHtml(raw));
}

// Versión segura para enviar a la IA: convierte "[Texto](url)" en
// solo "Texto", sin la sintaxis de marcado que podría confundirla.
export function stripLinksToPlainText(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

export interface DescriptionPart {
  type: "text" | "link";
  content: string;
  href?: string;
}

// Para renderizar en JSX: separa el texto en trozos de texto plano y
// trozos de enlace, conservando el orden original.
export function parseLinks(text: string): DescriptionPart[] {
  const parts: DescriptionPart[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: "link", content: match[1], href: match[2] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }
  return parts;
}

// Si el enlace apunta a un personaje de AniList, lo convierte en un
// enlace interno a su propia ficha de personaje
export function resolveCharacterLink(href: string): {
  href: string;
  internal: boolean;
} {
  const match = href.match(/anilist\.co\/character\/(\d+)/);
  if (match) return { href: `/characters/${match[1]}`, internal: true };
  return { href, internal: false };
}

// Corta el texto sin partir una palabra a la mitad, añadiendo "…"
export function truncateDescription(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

// Quita un guion final suelto (16- → 16), sin tocar rangos completos
// como "16-17", que sí deben mostrarse enteros
export function cleanAge(age: string): string {
  return age
    .trim()
    .replace(/[-–—]\s*$/, "")
    .trim();
}
