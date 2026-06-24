type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  node?: string;
  durationMs?: number;
  [key: string]: unknown;
}

function formatMessage(
  level: LogLevel,
  message: string,
  context?: LogContext,
): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` ${JSON.stringify(context)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
}

function log(level: LogLevel, message: string, context?: LogContext): void {
  const formatted = formatMessage(level, message, context);

  switch (level) {
    case "error":
      console.error(formatted);
      break;
    case "warn":
      console.warn(formatted);
      break;
    case "debug":
      console.debug(formatted);
      break;
    default:
      console.log(formatted);
  }
}

export const logger = {
  debug: (message: string, context?: LogContext) =>
    log("debug", message, context),
  info: (message: string, context?: LogContext) =>
    log("info", message, context),
  warn: (message: string, context?: LogContext) =>
    log("warn", message, context),
  error: (message: string, context?: LogContext) =>
    log("error", message, context),

  nodeStart: (nodeName: string, input?: Record<string, unknown>) =>
    log("info", `Node started: ${nodeName}`, { node: nodeName, input }),

  nodeComplete: (nodeName: string, durationMs: number) =>
    log("info", `Node completed: ${nodeName}`, { node: nodeName, durationMs }),

  nodeError: (nodeName: string, error: unknown, durationMs: number) =>
    log("error", `Node failed: ${nodeName}`, {
      node: nodeName,
      durationMs,
      error: error instanceof Error ? error.message : String(error),
    }),
};
