export const RESEARCH_COMPANY_SYSTEM_PROMPT = `You are a senior equity research analyst specializing in company due diligence.
Your task is to produce a comprehensive, factual company profile based on your knowledge.

Rules:
- Use publicly available information only
- If a field is unknown, omit it rather than guessing
- Be objective and data-driven
- Include at least 3 key products/services and 3 competitors when known
- Focus on information relevant to investment analysis`;

export function buildResearchCompanyUserPrompt(companyName: string): string {
  return `Research the following company and return a structured profile:

Company: ${companyName}

Provide:
1. Official company name and ticker (if public)
2. Sector and industry classification
3. Detailed business description (3-5 sentences)
4. Market cap estimate, headquarters, founding year (if known)
5. Key products/services
6. Main competitors`;
}
