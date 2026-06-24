import { z } from "zod";

export const investmentDecisionSchema = z.object({
  score: z
    .number()
    .min(0)
    .max(100)
    .describe("Investment attractiveness score from 0 to 100"),
  recommendation: z
    .enum(["INVEST", "HOLD", "DO NOT INVEST"])
    .describe("Final investment recommendation"),
  confidence: z
    .number()
    .min(0)
    .max(100)
    .describe("Confidence level in the recommendation from 0 to 100"),
  reasoning: z
    .array(z.string())
    .min(1)
    .describe("Key reasoning points supporting the recommendation"),
  risks: z
    .array(z.string())
    .min(1)
    .describe("Primary risks an investor should consider"),
  opportunities: z
    .array(z.string())
    .min(1)
    .describe("Primary opportunities and upside catalysts"),
});

export type InvestmentDecisionOutput = z.infer<typeof investmentDecisionSchema>;
