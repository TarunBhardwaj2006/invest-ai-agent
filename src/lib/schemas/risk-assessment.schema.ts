import { z } from "zod";

export const riskAssessmentSchema = z.object({
  overallRiskLevel: z
    .enum(["low", "moderate", "high", "critical"])
    .describe("Overall investment risk level"),
  riskScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Risk score from 0 (minimal risk) to 100 (extreme risk)"),
  risks: z
    .array(
      z.object({
        category: z.string().describe("Risk category e.g. market, regulatory, operational"),
        description: z.string(),
        severity: z.enum(["low", "medium", "high"]),
      }),
    )
    .min(1)
    .describe("Identified investment risks"),
  mitigatingFactors: z
    .array(z.string())
    .describe("Factors that may offset identified risks"),
  summary: z.string().describe("Executive summary of risk profile"),
});

export type RiskAssessmentOutput = z.infer<typeof riskAssessmentSchema>;
