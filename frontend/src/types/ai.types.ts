export interface SelectedCharacter {
  id: number;
  characterName: string;
  animeName: string;
  characterDescription: string;
  image: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  character: SelectedCharacter;
}

export interface AnalyzeAnimeRequest {
  character: SelectedCharacter;
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

export interface AnalyzeCharacterRequest {
  character: SelectedCharacter;
  targetCharacter: {
    name: string;
    description: string;
    animes: string[];
  };
}

export interface AiResponse {
  reply: string;
}

export interface AnalyzeResponse {
  analysis: string;
}
