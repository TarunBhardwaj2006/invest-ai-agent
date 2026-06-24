import { invokeStructured } from "@/lib/llm/structured-output";
import {
  INVESTMENT_DECISION_SYSTEM_PROMPT,
  buildInvestmentDecisionUserPrompt,
} from "@/lib/llm/prompts/investment-decision";
import { investmentDecisionSchema } from "@/lib/schemas/investment-decision.schema";
import { createNode, requireState } from "@/lib/langgraph/utils/create-node";
import type { ResearchGraphState } from "@/types/langgraph";

const NODE_NAME = "InvestmentDecisionNode";

async function investmentDecisionHandler(
  state: ResearchGraphState,
): Promise<Partial<ResearchGraphState>> {
  const companyProfile = requireState(
    state.companyProfile,
    NODE_NAME,
    "companyProfile",
  );
  const financialHealth = requireState(
    state.financialHealth,
    NODE_NAME,
    "financialHealth",
  );
  const newsSentiment = requireState(
    state.newsSentiment,
    NODE_NAME,
    "newsSentiment",
  );
  const riskAssessment = requireState(
    state.riskAssessment,
    NODE_NAME,
    "riskAssessment",
  );

  const decision = await invokeStructured(
    NODE_NAME,
    investmentDecisionSchema,
    INVESTMENT_DECISION_SYSTEM_PROMPT,
    buildInvestmentDecisionUserPrompt(
      companyProfile,
      financialHealth,
      newsSentiment,
      riskAssessment,
    ),
  );

  return {
    decision,
    progress: {
      step: "completed",
      message: `Recommendation: ${decision.recommendation} (score: ${decision.score}/100)`,
      progress: 100,
    },
  };
}

export const investmentDecisionNode = createNode(
  NODE_NAME,
  investmentDecisionHandler,
);
