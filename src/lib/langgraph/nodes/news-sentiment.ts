import { invokeStructured } from "@/lib/llm/structured-output";
import {
  NEWS_SENTIMENT_SYSTEM_PROMPT,
  buildNewsSentimentUserPrompt,
} from "@/lib/llm/prompts/news-sentiment";
import { newsSentimentSchema } from "@/lib/schemas/news-sentiment.schema";
import { createNode, requireState } from "@/lib/langgraph/utils/create-node";
import type { ResearchGraphState } from "@/types/langgraph";

const NODE_NAME = "NewsSentimentNode";

async function newsSentimentHandler(
  state: ResearchGraphState,
): Promise<Partial<ResearchGraphState>> {
  const companyProfile = requireState(
    state.companyProfile,
    NODE_NAME,
    "companyProfile",
  );

  const newsSentiment = await invokeStructured(
    NODE_NAME,
    newsSentimentSchema,
    NEWS_SENTIMENT_SYSTEM_PROMPT,
    buildNewsSentimentUserPrompt(companyProfile),
  );

  return {
    newsSentiment,
    progress: {
      step: "analyzing_news_sentiment",
      message: `News sentiment: ${newsSentiment.overallSentiment} (${newsSentiment.sentimentScore})`,
      progress: 60,
    },
  };
}

export const newsSentimentNode = createNode(NODE_NAME, newsSentimentHandler);
