import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AppError } from "@/lib/utils/errors";

export const GEMINI_MODEL = "gemini-2.5-flash";

let geminiModel: ChatGoogleGenerativeAI | null = null;

function getApiKey(): string {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new AppError(
      "MISSING_API_KEY",
      "GOOGLE_API_KEY environment variable is not set",
      500,
    );
  }

  return apiKey;
}

export function getGeminiModel(): ChatGoogleGenerativeAI {
  if (!geminiModel) {
    geminiModel = new ChatGoogleGenerativeAI({
      model: GEMINI_MODEL,
      apiKey: getApiKey(),
      temperature: 0.2,
      maxOutputTokens: 8192,
    });
  }

  return geminiModel;
}

/** Reset cached model — useful for testing */
export function resetGeminiModel(): void {
  geminiModel = null;
}
