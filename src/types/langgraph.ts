import { Annotation } from "@langchain/langgraph";
import type {
  CompanyInput,
  CompanyProfile,
  FinancialHealthAnalysis,
  InvestmentDecision,
  NewsSentimentAnalysis,
  ResearchProgress,
  RiskAssessmentAnalysis,
} from "./research";

/**
 * LangGraph shared state annotation.
 * Each node reads from and writes to these channels.
 */
export const ResearchStateAnnotation = Annotation.Root({
  companyInput: Annotation<CompanyInput>(),

  companyProfile: Annotation<CompanyProfile | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  financialHealth: Annotation<FinancialHealthAnalysis | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  newsSentiment: Annotation<NewsSentimentAnalysis | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  riskAssessment: Annotation<RiskAssessmentAnalysis | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  decision: Annotation<InvestmentDecision | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),

  progress: Annotation<ResearchProgress>({
    reducer: (_, next) => next,
    default: () => ({
      step: "idle",
      message: "Waiting to start",
      progress: 0,
    }),
  }),
  errors: Annotation<string[]>({
    reducer: (prev, next) => [...prev, ...next],
    default: () => [],
  }),
});

export type ResearchGraphState = typeof ResearchStateAnnotation.State;

export type GraphNodeId =
  | "research_company"
  | "financial_health"
  | "news_sentiment"
  | "risk_assessment"
  | "investment_decision";
