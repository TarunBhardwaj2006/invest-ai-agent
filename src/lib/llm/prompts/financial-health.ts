import type { CompanyProfile } from "@/types/research";

export const FINANCIAL_HEALTH_SYSTEM_PROMPT = `You are a financial analyst specializing in corporate financial health assessment.
Analyze the company's financial position based on available public information.

Rules:
- Base analysis on known financial metrics and trends
- Score overallHealthScore from 0-100 (100 = excellent financial health)
- Provide at least 3 key metrics with label, value, and assessment
- Be conservative when data is limited — note uncertainty in assessments
- Revenue trend must reflect the most recent available period`;

export function buildFinancialHealthUserPrompt(profile: CompanyProfile): string {
  return `Analyze the financial health of the following company:

Company: ${profile.name}
${profile.ticker ? `Ticker: ${profile.ticker}` : ""}
Sector: ${profile.sector ?? "Unknown"}
Industry: ${profile.industry ?? "Unknown"}
Description: ${profile.description}
${profile.marketCap ? `Market Cap: ${profile.marketCap}` : ""}

Assess:
1. Overall financial health score (0-100)
2. Revenue trend (growing/stable/declining)
3. Profitability and margins
4. Debt level (low/moderate/high)
5. Cash flow generation
6. Key financial metrics with assessments
7. Executive summary`;
}
