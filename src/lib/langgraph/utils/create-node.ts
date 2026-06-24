import type { ResearchGraphState } from "@/types/langgraph";
import { NodeExecutionError } from "@/lib/utils/errors";
import { logger } from "@/lib/utils/logger";

type NodeResult = Partial<ResearchGraphState>;

type NodeHandler = (state: ResearchGraphState) => Promise<NodeResult>;

export function createNode(nodeName: string, handler: NodeHandler): NodeHandler {
  return async (state: ResearchGraphState): Promise<NodeResult> => {
    const startTime = Date.now();

    logger.nodeStart(nodeName, {
      company: state.companyInput?.companyName,
    });

    try {
      const result = await handler(state);
      logger.nodeComplete(nodeName, Date.now() - startTime);
      return result;
    } catch (error) {
      logger.nodeError(nodeName, error, Date.now() - startTime);

      const message =
        error instanceof NodeExecutionError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Unknown node execution error";

      throw new NodeExecutionError(nodeName, message, error);
    }
  };
}

export function requireState<T>(
  value: T | null | undefined,
  nodeName: string,
  fieldName: string,
): T {
  if (value == null) {
    throw new NodeExecutionError(
      nodeName,
      `Required state field "${fieldName}" is missing`,
    );
  }

  return value;
}
