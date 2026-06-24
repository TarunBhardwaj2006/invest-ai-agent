import { z } from "zod";
import { AppError } from "./errors";

export const researchRequestSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(200, "Company name must be 200 characters or fewer"),
});

export type ResearchRequestInput = z.infer<typeof researchRequestSchema>;

export function parseResearchRequest(body: unknown): ResearchRequestInput {
  const result = researchRequestSchema.safeParse(body);

  if (!result.success) {
    const message = result.error.errors.map((e) => e.message).join("; ");
    throw new AppError("VALIDATION_ERROR", message, 400, result.error.flatten());
  }

  return result.data;
}
