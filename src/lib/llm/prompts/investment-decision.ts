import type {
  CompanyProfile,
  FinancialHealthAnalysis,
  NewsSentimentAnalysis,
  RiskAssessmentAnalysis,
} from "@/types/research";

export const INVESTMENT_DECISION_SYSTEM_PROMPT = `You are a senior portfolio manager making final investment recommendations.
Synthesize all research into a clear, actionable investment decision.

Rules:
- score (0-100): investment attractiveness (100 = highly attractive)
- recommendation: INVEST (score >= 70), HOLD (40-69), DO NOT INVEST (< 40) — adjust based on holistic analysis
- confidence (0-100): how confident you are in this recommendation given data quality
- reasoning: 3-6 clear bullet points supporting the decision
- risks: top 3-5 risks the investor must consider
- opportunities: top 3-5 upside catalysts
- Be decisive but acknowledge uncertainty when data is limited`;

export function buildInvestmentDecisionUserPrompt(
  profile: CompanyProfile,
  financialHealth: FinancialHealthAnalysis,
  newsSentiment: NewsSentimentAnalysis,
  riskAssessment: RiskAssessmentAnalysis,
): string {
  return `Make a final investment decision for the following company:

Company: ${profile.name}
${profile.ticker ? `Ticker: ${profile.ticker}` : ""}
Sector: ${profile.sector ?? "Unknown"}
Industry: ${profile.industry ?? "Unknown"}
Description: ${profile.description}
Key Products: ${profile.keyProducts.join(", ")}
Competitors: ${profile.competitors.join(", ")}

Financial Health:
- Score: ${financialHealth.overallHealthScore}/100
- Revenue Trend: ${financialHealth.revenueTrend}
- Profitability: ${financialHealth.profitability}
- Debt: ${financialHealth.debtLevel}
- Cash Flow: ${financialHealth.cashFlow}
- Summary: ${financialHealth.summary}

News Sentiment:
- Overall: ${newsSentiment.overallSentiment} (${newsSentiment.sentimentScore})
- Themes: ${newsSentiment.keyThemes.join(", ")}
- Summary: ${newsSentiment.summary}

Risk Assessment:
- Risk Level: ${riskAssessment.overallRiskLevel}
- Risk Score: ${riskAssessment.riskScore}/100
- Top Risks: ${riskAssessment.risks.map((r) => `${r.category}: ${r.description}`).join("; ")}
- Mitigating Factors: ${riskAssessment.mitigatingFactors.join(", ")}
- Summary: ${riskAssessment.summary}

Return your final investment decision with score, recommendation, confidence, reasoning, risks, and opportunities.`;
}
