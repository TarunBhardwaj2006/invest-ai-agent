/**
 * Core domain types for the Investment Research Agent.
 * These types mirror LangGraph state slices and API response contracts.
 */

export type Recommendation = "INVEST" | "HOLD" | "DO NOT INVEST";

export interface CompanyInput {
  companyName: string;
}

export interface CompanyProfile {
  name: string;
  ticker?: string;
  sector?: string;
  industry?: string;
  description: string;
  marketCap?: string;
  headquarters?: string;
  founded?: string;
  keyProducts: string[];
  competitors: string[];
}

export interface FinancialHealthAnalysis {
  overallHealthScore: number;
  revenueTrend: "growing" | "stable" | "declining";
  profitability: string;
  debtLevel: "low" | "moderate" | "high";
  cashFlow: string;
  keyMetrics: Array<{
    label: string;
    value: string;
    assessment: string;
  }>;
  summary: string;
}

export interface NewsArticle {
  title: string;
  sentiment: "positive" | "neutral" | "negative";
  summary: string;
  date?: string;
}

export interface NewsSentimentAnalysis {
  overallSentiment: "positive" | "neutral" | "negative";
  sentimentScore: number;
  articles: NewsArticle[];
  keyThemes: string[];
  summary: string;
}

export interface IdentifiedRisk {
  category: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export interface RiskAssessmentAnalysis {
  overallRiskLevel: "low" | "moderate" | "high" | "critical";
  riskScore: number;
  risks: IdentifiedRisk[];
  mitigatingFactors: string[];
  summary: string;
}

export interface InvestmentDecision {
  score: number;
  recommendation: Recommendation;
  confidence: number;
  reasoning: string[];
  risks: string[];
  opportunities: string[];
}

export interface ResearchResult {
  company: CompanyProfile;
  financialHealth: FinancialHealthAnalysis;
  newsSentiment: NewsSentimentAnalysis;
  riskAssessment: RiskAssessmentAnalysis;
  decision: InvestmentDecision;
  generatedAt: string;
}

export type ResearchStep =
  | "idle"
  | "researching"
  | "analyzing_financial_health"
  | "analyzing_news_sentiment"
  | "assessing_risks"
  | "making_investment_decision"
  | "completed"
  | "error";

export interface ResearchProgress {
  step: ResearchStep;
  message: string;
  progress: number;
}
