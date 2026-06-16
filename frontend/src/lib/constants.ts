import { SelectedCharacter } from "@/types/ai.types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// Personaje que usa la IA por defecto si el usuario no ha elegido ninguno
export const DEFAULT_CHARACTER: SelectedCharacter = {
  id: 34470,
  characterName: "Kurisu Makise",
  animeName: "Steins;Gate",
  characterDescription: `Kurisu es miembro de investigación del Programa de Investigación Cerebral de la Universidad 
  Viktor Chondria. Su edad coincide con la de los alumnos en su penúltimo año de secundaria, pero se saltó un grado 
  a través del sistema educativo estadounidense. También es famosa en Estados Unidos por escribir artículos académicos, 
  algunos de los cuales han aparecido en las noticias. Debido a que, siendo una chica, adelantó un grado en Estados Unidos, 
  la gente a su alrededor la envidiaba, y eso acabó forjándola como una persona de carácter fuerte. No quiere mostrar 
  debilidad a los demás, así que siempre mantiene una expresión severa. Sin embargo, es muy curiosa y, cuando algo le 
  interesa, se mete de lleno en ello. Ocasionalmente, tiene opiniones que difieren de las comunes, como: «Los datos del 
  experimento son más importantes que la privacidad del sujeto». Rintarou suele decirle: «Oye, tienes un sentido bastante 
  bueno para ser una científica loca», pero ella no está dispuesta a aceptar algo así personalmente. Es una tsundere.`,
  image:
    "https://s4.anilist.co/file/anilistcdn/character/large/b34470-Jw2LXZBL5R8i.png",
};

export const SELECTED_CHARACTER_KEY = "animai_selected_character";

// ... resto de constantes (SORT_OPTIONS, SEASON_OPTIONS, etc.)
