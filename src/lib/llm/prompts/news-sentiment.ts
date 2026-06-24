import type { CompanyProfile } from "@/types/research";

export const NEWS_SENTIMENT_SYSTEM_PROMPT = `You are a financial news analyst specializing in market sentiment analysis.
Analyze recent news coverage and market perception for the given company.

Rules:
- Focus on news from the last 3-6 months
- sentimentScore ranges from -100 (very negative) to 100 (very positive)
- Include at least 3 representative news items (real or representative of known trends)
- Identify recurring themes in media coverage
- Be balanced — include both positive and negative coverage when applicable`;

export function buildNewsSentimentUserPrompt(profile: CompanyProfile): string {
  return `Analyze recent news sentiment for the following company:

Company: ${profile.name}
${profile.ticker ? `Ticker: ${profile.ticker}` : ""}
Sector: ${profile.sector ?? "Unknown"}
Industry: ${profile.industry ?? "Unknown"}
Description: ${profile.description}

Provide:
1. Overall sentiment (positive/neutral/negative)
2. Sentiment score (-100 to 100)
3. Recent news articles with individual sentiment
4. Key themes in recent coverage
5. Summary of market perception`;
}
