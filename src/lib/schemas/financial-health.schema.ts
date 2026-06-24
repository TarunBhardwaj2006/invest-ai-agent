import { z } from "zod";

export const financialHealthSchema = z.object({
  overallHealthScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Overall financial health score from 0 to 100"),
  revenueTrend: z
    .enum(["growing", "stable", "declining"])
    .describe("Recent revenue trajectory"),
  profitability: z
    .string()
    .describe("Assessment of profit margins and earnings"),
  debtLevel: z
    .enum(["low", "moderate", "high"])
    .describe("Current debt burden relative to assets"),
  cashFlow: z.string().describe("Cash flow generation assessment"),
  keyMetrics: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        assessment: z.string(),
      }),
    )
    .min(2)
    .describe("Important financial metrics with assessments"),
  summary: z.string().describe("Executive summary of financial health"),
});

export type FinancialHealthOutput = z.infer<typeof financialHealthSchema>;
