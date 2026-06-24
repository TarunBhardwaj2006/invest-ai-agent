import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { z } from "zod";
import { getGeminiModel } from "./gemini";
import { NodeExecutionError } from "@/lib/utils/errors";
import { logger } from "@/lib/utils/logger";

export async function invokeStructured<T extends z.ZodType>(
  nodeName: string,
  schema: T,
  systemPrompt: string,
  userPrompt: string,
): Promise<z.infer<T>> {
  const model = getGeminiModel().withStructuredOutput(schema, {
    name: `${nodeName}_output`,
  });

  try {
    const result = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt),
    ]);

    logger.debug(`Structured output received from ${nodeName}`, { node: nodeName });
    return result;
  } catch (error: any) {
  console.error("================================");
  console.error("GEMINI RAW ERROR");
  console.error(JSON.stringify(error, null, 2));
  console.error("================================");
  if (error?.cause) {
    console.error("CAUSE:");
    console.error(JSON.stringify(error.cause, null, 2));
  }

  throw new NodeExecutionError(
    nodeName,
    `Failed to generate structured output from Gemini: ${error?.message || "Unknown error"}`,
    error,    
    );
  }
}
