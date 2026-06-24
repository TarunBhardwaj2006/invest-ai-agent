import { z } from "zod";

export const companyProfileSchema = z.object({
  name: z.string().describe("Official company name"),
  ticker: z.string().optional().describe("Stock ticker symbol if publicly traded"),
  sector: z.string().optional().describe("Business sector"),
  industry: z.string().optional().describe("Specific industry"),
  description: z.string().describe("Comprehensive company overview"),
  marketCap: z.string().optional().describe("Approximate market capitalization"),
  headquarters: z.string().optional().describe("Headquarters location"),
  founded: z.string().optional().describe("Year founded"),
  keyProducts: z
    .array(z.string())
    .min(1)
    .describe("Primary products or services"),
  competitors: z
    .array(z.string())
    .describe("Main competitors in the market"),
});

export type CompanyProfileOutput = z.infer<typeof companyProfileSchema>;
