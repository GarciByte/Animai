import { fetchApi } from "@/lib/api";
import {
  ChatRequest,
  ChatResponse,
  AnalyzeAnimeRequest,
  AnalyzeCharacterRequest,
  AnalysisResponse,
  TranslateRequest,
  TranslateResponse,
} from "@/types/ai.types";

export const aiService = {
  chat(dto: ChatRequest): Promise<ChatResponse> {
    return fetchApi<ChatResponse>("/api/ai/chat", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  analyzeAnime(dto: AnalyzeAnimeRequest): Promise<AnalysisResponse> {
    return fetchApi<AnalysisResponse>("/api/ai/analyze/anime", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  analyzeCharacter(dto: AnalyzeCharacterRequest): Promise<AnalysisResponse> {
    return fetchApi<AnalysisResponse>("/api/ai/analyze/character", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  translate(dto: TranslateRequest): Promise<TranslateResponse> {
    return fetchApi<TranslateResponse>("/api/ai/translate", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },
};
