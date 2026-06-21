# Animai

Aplicación web para descubrir anime y personajes, y conversar con una IA que interpreta a tu personaje favorito.

---

## Índice

- [Animai](#animai)
  - [Índice](#índice)
  - [Descripción](#descripción)
  - [Características principales](#características-principales)
  - [Stack tecnológico](#stack-tecnológico)
    - [Backend](#backend)
    - [Frontend](#frontend)
    - [APIs externas](#apis-externas)
    - [Despliegue](#despliegue)
  - [Requisitos previos](#requisitos-previos)
  - [Instalación](#instalación)
  - [Variables de entorno](#variables-de-entorno)
    - [`Backend/.env`](#backendenv)
    - [`Frontend/.env.local`](#frontendenvlocal)
  - [Ejecución en desarrollo](#ejecución-en-desarrollo)

---

## Descripción

**Animai** es una aplicación web que permite buscar, filtrar y explorar animes y personajes combinando datos de varias APIs externas (AniList, Jikan, AnimeThemes y TMDB), y conversar con un modelo de IA (a través de OpenRouter) que interpreta a cualquier personaje de anime elegido por el usuario. La IA también puede analizar animes y personajes dando su opinión "en personaje", y traducir textos del inglés al español usando contexto adicional para mayor precisión.

La aplicación **no usa base de datos**: toda la información proviene de las APIs externas en tiempo real (con caché en memoria en el backend para reducir peticiones repetidas), y los datos propios del usuario — el personaje activo de la IA y el historial de chat — se guardan únicamente en el navegador (`localStorage`).

---

## Características principales

- 🔍 Buscador de anime con filtros combinables (vistas rápidas, orden, temporada, año, formato, estado, género) y scroll infinito.
- 📖 Ficha de detalle de anime con sinopsis traducible, ficha técnica, tags, vídeos promocionales, openings/endings, galería de imágenes, reseñas, noticias, animes relacionados/similares y enlaces externos.
- 👤 Buscador de personajes ordenado por popularidad, con scroll infinito.
- 🪪 Ficha de detalle de personaje con datos biográficos, descripción traducible y limpia de ruido, y sus apariciones en anime agrupadas por rol.
- 💬 Chat con una IA que interpreta al personaje que elijas — cambiable en cualquier momento desde la ficha de cualquier personaje.
- 🧠 Análisis con IA de animes y personajes, mostrado en un modal.
- 🌐 Traducción de textos al español usando IA con contexto adicional (anime o personaje) para mayor precisión.
- 💾 Todo el estado del usuario persiste en `localStorage`, sin necesidad de cuenta ni base de datos.

---

## Stack tecnológico

### Backend
- **NestJS** + TypeScript
- Caché en memoria (`@nestjs/cache-manager`)
- Rate limiting (`@nestjs/throttler`)
- Validación de DTOs (`class-validator` / `class-transformer`)
- Documentación interactiva con **Swagger** (solo en desarrollo)
- Logging con **Winston** (consola + archivo rotativo diario)

### Frontend
- **Next.js** (App Router) + React + TypeScript
- **Tailwind CSS v4**
- Componentes propios, sin librería de UI externa

### APIs externas
| API | Uso |
|---|---|
| [AniList](https://anilist.co/) (GraphQL) | Datos principales de anime y personajes |
| [Jikan](https://jikan.moe/) (MyAnimeList no oficial) | Noticias, imágenes, reseñas, vídeos promocionales |
| [AnimeThemes](https://animethemes.moe/) | Vídeos de openings y endings |
| [TMDB](https://www.themoviedb.org/) | Sinopsis, posters y backdrops en español |
| [OpenRouter](https://openrouter.ai/) | Modelo de IA para el chat, los análisis y las traducciones |

### Despliegue
- Backend en **[Render](https://render.com/)**
- Frontend en **[Vercel](https://vercel.com/)**
- URL: https://animai-app.vercel.app/

---

## Requisitos previos

- **Node.js** 20 o superior
- **pnpm**
- Claves de API de **TMDB** y **OpenRouter** (AniList, Jikan y AnimeThemes no requieren clave)

---

## Instalación

```bash
git clone <https://github.com/GarciByte/Animai>
cd Animai

cd backend
pnpm install

cd ../frontend
pnpm install
```

---

## Variables de entorno

### `backend/.env`

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (Render lo asigna automáticamente en producción) |
| `FRONTEND_URL` | URL del frontend, usada para configurar CORS |
| `ANILIST_API_URL` | URL del endpoint GraphQL de AniList |
| `JIKAN_API_URL` | URL base de la API de Jikan |
| `ANIMETHEMES_API_URL` | URL base de la API de AnimeThemes |
| `TMDB_API_URL` / `TMDB_API_KEY` | URL base y clave de la API de TMDB |
| `OPENROUTER_API_URL` / `OPENROUTER_API_KEY` / `OPENROUTER_MODEL` | Configuración del modelo de IA |
| `CACHE_TTL` | TTL por defecto de la caché en memoria (segundos) |
| `THROTTLE_TTL` / `THROTTLE_LIMIT` | Ventana y límite por defecto del rate limiting |
| `NODE_ENV` | `development` o `production` — desactiva Swagger en producción |

### `frontend/.env.local`

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL base del backend, **sin** `/api` al final |

---

## Ejecución en desarrollo

```bash
# Terminal 1 — backend
cd backend
pnpm run start:dev
# http://localhost:3001

# Terminal 2 — frontend
cd frontend
pnpm run dev
# http://localhost:3000
```

---
 
## Documentación de la API
 
En desarrollo, Swagger está disponible en **`http://localhost:3001/docs`**. Se desactiva automáticamente cuando `NODE_ENV=production`.