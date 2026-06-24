import { invokeStructured } from "@/lib/llm/structured-output";
import {
  RESEARCH_COMPANY_SYSTEM_PROMPT,
  buildResearchCompanyUserPrompt,
} from "@/lib/llm/prompts/research-company";
import { companyProfileSchema } from "@/lib/schemas/company-profile.schema";
import { createNode } from "@/lib/langgraph/utils/create-node";
import type { ResearchGraphState } from "@/types/langgraph";
import { NodeExecutionError } from "@/lib/utils/errors";

const NODE_NAME = "ResearchCompanyNode";

async function researchCompanyHandler(
  state: ResearchGraphState,
): Promise<Partial<ResearchGraphState>> {
  const companyName = state.companyInput?.companyName;

  if (!companyName?.trim()) {
    throw new NodeExecutionError(NODE_NAME, "Company name is required");
  }

  const companyProfile = await invokeStructured(
    NODE_NAME,
    companyProfileSchema,
    RESEARCH_COMPANY_SYSTEM_PROMPT,
    buildResearchCompanyUserPrompt(companyName),
  );

  return {
    companyProfile,
    progress: {
      step: "researching",
      message: `Completed research on ${companyProfile.name}`,
      progress: 20,
    },
  };
}

export const researchCompanyNode = createNode(NODE_NAME, researchCompanyHandler);
