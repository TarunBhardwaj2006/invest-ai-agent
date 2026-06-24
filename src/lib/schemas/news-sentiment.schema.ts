import { z } from "zod";

export const newsSentimentSchema = z.object({
  overallSentiment: z
    .enum(["positive", "neutral", "negative"])
    .describe("Aggregate news sentiment"),
  sentimentScore: z
    .number()
    .min(-100)
    .max(100)
    .describe("Sentiment score from -100 (very negative) to 100 (very positive)"),
  articles: z
    .array(
      z.object({
        title: z.string(),
        sentiment: z.enum(["positive", "neutral", "negative"]),
        summary: z.string(),
        date: z.string().optional(),
      }),
    )
    .min(1)
    .describe("Recent news articles with sentiment analysis"),
  keyThemes: z
    .array(z.string())
    .min(1)
    .describe("Recurring themes in recent news coverage"),
  summary: z.string().describe("Summary of news sentiment and market perception"),
});

export type NewsSentimentOutput = z.infer<typeof newsSentimentSchema>;
