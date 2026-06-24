export type ErrorCode =
  | "VALIDATION_ERROR"
  | "NODE_EXECUTION_ERROR"
  | "GRAPH_EXECUTION_ERROR"
  | "MISSING_API_KEY"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly details?: unknown;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode = 500,
    details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class NodeExecutionError extends AppError {
  readonly nodeName: string;

  constructor(nodeName: string, message: string, cause?: unknown) {
    super("NODE_EXECUTION_ERROR", `[${nodeName}] ${message}`, 500, cause);
    this.name = "NodeExecutionError";
    this.nodeName = nodeName;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError("INTERNAL_ERROR", error.message);
  }

  return new AppError("INTERNAL_ERROR", "An unexpected error occurred");
}
