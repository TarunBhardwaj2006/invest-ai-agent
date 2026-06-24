import { invokeStructured } from "@/lib/llm/structured-output";
import {
  FINANCIAL_HEALTH_SYSTEM_PROMPT,
  buildFinancialHealthUserPrompt,
} from "@/lib/llm/prompts/financial-health";
import { financialHealthSchema } from "@/lib/schemas/financial-health.schema";
import { createNode, requireState } from "@/lib/langgraph/utils/create-node";
import type { ResearchGraphState } from "@/types/langgraph";

const NODE_NAME = "FinancialHealthNode";

async function financialHealthHandler(
  state: ResearchGraphState,
): Promise<Partial<ResearchGraphState>> {
  const companyProfile = requireState(
    state.companyProfile,
    NODE_NAME,
    "companyProfile",
  );

  const financialHealth = await invokeStructured(
    NODE_NAME,
    financialHealthSchema,
    FINANCIAL_HEALTH_SYSTEM_PROMPT,
    buildFinancialHealthUserPrompt(companyProfile),
  );

  return {
    financialHealth,
    progress: {
      step: "analyzing_financial_health",
      message: `Financial health score: ${financialHealth.overallHealthScore}/100`,
      progress: 40,
    },
  };
}

export const financialHealthNode = createNode(NODE_NAME, financialHealthHandler);
