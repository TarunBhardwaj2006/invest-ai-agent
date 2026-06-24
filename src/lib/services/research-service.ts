import { getResearchGraph } from "@/lib/langgraph/graph";
import { logger } from "@/lib/utils/logger";
import { NodeExecutionError, toAppError } from "@/lib/utils/errors";
import type { ResearchGraphState } from "@/types/langgraph";
import type { ResearchProgress, ResearchResult } from "@/types/research";

function mapStateToResult(state: ResearchGraphState): ResearchResult {
  const { companyProfile, financialHealth, newsSentiment, riskAssessment, decision } =
    state;

  if (!companyProfile || !financialHealth || !newsSentiment || !riskAssessment || !decision) {
    throw new NodeExecutionError(
      "ResearchService",
      "Graph completed but one or more required outputs are missing",
      { companyProfile: !!companyProfile, financialHealth: !!financialHealth, newsSentiment: !!newsSentiment, riskAssessment: !!riskAssessment, decision: !!decision },
    );
  }

  return {
    company: companyProfile,
    financialHealth,
    newsSentiment,
    riskAssessment,
    decision,
    generatedAt: new Date().toISOString(),
  };
}

export async function runResearch(companyName: string): Promise<ResearchResult> {
  const graph = getResearchGraph();

  logger.info("Starting research pipeline", { companyName });

  try {
    const finalState = await graph.invoke({
      companyInput: { companyName },
    });

    if (finalState.errors.length > 0) {
      throw new NodeExecutionError(
        "ResearchService",
        finalState.errors.join("; "),
      );
    }

    const result = mapStateToResult(finalState);

    logger.info("Research pipeline completed", {
      companyName,
      recommendation: result.decision.recommendation,
      score: result.decision.score,
    });

    return result;
  } catch (error) {
    logger.error("Research pipeline failed", {
      companyName,
      error: error instanceof Error ? error.message : String(error),
    });
    throw toAppError(error);
  }
}

export type ProgressCallback = (progress: ResearchProgress) => void;

export async function runResearchWithProgress(
  companyName: string,
  onProgress: ProgressCallback,
): Promise<ResearchResult> {
  const graph = getResearchGraph();

  logger.info("Starting streaming research pipeline", { companyName });

  try {
    let finalState: ResearchGraphState | null = null;

    const stream = await graph.stream(
      { companyInput: { companyName } },
      { streamMode: "values" },
    );

    for await (const state of stream) {
      finalState = state as ResearchGraphState;

      if (finalState.progress) {
        onProgress(finalState.progress);
      }
    }

    if (!finalState) {
      throw new NodeExecutionError(
        "ResearchService",
        "Graph stream ended without producing state",
      );
    }

    if (finalState.errors.length > 0) {
      throw new NodeExecutionError(
        "ResearchService",
        finalState.errors.join("; "),
      );
    }

    const result = mapStateToResult(finalState);

    logger.info("Streaming research pipeline completed", {
      companyName,
      recommendation: result.decision.recommendation,
      score: result.decision.score,
    });

    return result;
  } catch (error) {
    logger.error("Streaming research pipeline failed", {
      companyName,
      error: error instanceof Error ? error.message : String(error),
    });
    throw toAppError(error);
  }
}
