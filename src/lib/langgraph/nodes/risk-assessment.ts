import { invokeStructured } from "@/lib/llm/structured-output";
import {
  RISK_ASSESSMENT_SYSTEM_PROMPT,
  buildRiskAssessmentUserPrompt,
} from "@/lib/llm/prompts/risk-assessment";
import { riskAssessmentSchema } from "@/lib/schemas/risk-assessment.schema";
import { createNode, requireState } from "@/lib/langgraph/utils/create-node";
import type { ResearchGraphState } from "@/types/langgraph";

const NODE_NAME = "RiskAssessmentNode";

async function riskAssessmentHandler(
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

  const riskAssessment = await invokeStructured(
    NODE_NAME,
    riskAssessmentSchema,
    RISK_ASSESSMENT_SYSTEM_PROMPT,
    buildRiskAssessmentUserPrompt(
      companyProfile,
      financialHealth,
      newsSentiment,
    ),
  );

  return {
    riskAssessment,
    progress: {
      step: "assessing_risks",
      message: `Risk level: ${riskAssessment.overallRiskLevel} (${riskAssessment.riskScore}/100)`,
      progress: 80,
    },
  };
}

export const riskAssessmentNode = createNode(NODE_NAME, riskAssessmentHandler);
