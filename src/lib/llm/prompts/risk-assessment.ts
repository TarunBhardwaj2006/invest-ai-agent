import type {
  CompanyProfile,
  FinancialHealthAnalysis,
  NewsSentimentAnalysis,
} from "@/types/research";

export const RISK_ASSESSMENT_SYSTEM_PROMPT = `You are a risk management analyst specializing in equity investment risk assessment.
Identify and evaluate investment risks across multiple dimensions.

Rules:
- riskScore ranges from 0 (minimal risk) to 100 (extreme risk)
- Cover market, regulatory, operational, competitive, and financial risks
- Assign severity (low/medium/high) to each identified risk
- Include mitigating factors that could reduce risk exposure
- Be thorough but prioritize material risks`;

export function buildRiskAssessmentUserPrompt(
  profile: CompanyProfile,
  financialHealth: FinancialHealthAnalysis,
  newsSentiment: NewsSentimentAnalysis,
): string {
  return `Assess investment risks for the following company:

Company: ${profile.name}
${profile.ticker ? `Ticker: ${profile.ticker}` : ""}
Sector: ${profile.sector ?? "Unknown"}
Industry: ${profile.industry ?? "Unknown"}

Financial Health Summary:
- Health Score: ${financialHealth.overallHealthScore}/100
- Revenue Trend: ${financialHealth.revenueTrend}
- Debt Level: ${financialHealth.debtLevel}
- Summary: ${financialHealth.summary}

News Sentiment Summary:
- Sentiment: ${newsSentiment.overallSentiment} (${newsSentiment.sentimentScore})
- Key Themes: ${newsSentiment.keyThemes.join(", ")}
- Summary: ${newsSentiment.summary}

Provide:
1. Overall risk level (low/moderate/high/critical)
2. Risk score (0-100)
3. Identified risks with category, description, and severity
4. Mitigating factors
5. Executive risk summary`;
}
