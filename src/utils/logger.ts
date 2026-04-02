export type LogLevel = "info" | "warn" | "error";

export interface LogContext {
  requestId?: string;
  [key: string]: unknown;
}

const DEFAULT_SERVICE_NAME = "node-app";

export function getServiceName(): string {
  return process.env.SERVICE_NAME?.trim() || DEFAULT_SERVICE_NAME;
}

function writeLog(level: LogLevel, message: string, context: LogContext = {}): void {
  const { requestId = "system", ...rest } = context;
  const entry = {
    timestamp: new Date().toISOString(),
    service: getServiceName(),
    level,
    message,
    requestId,
    ...rest,
  };

  const line = `${JSON.stringify(entry)}\n`;
  const output = level === "error" ? process.stderr : process.stdout;
  output.write(line);
}

export function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: typeof error === "string" ? error : "Unknown error",
  };
}

export const logger = {
  info(message: string, context?: LogContext): void {
    writeLog("info", message, context);
  },
  warn(message: string, context?: LogContext): void {
    writeLog("warn", message, context);
  },
  error(message: string, context?: LogContext): void {
    writeLog("error", message, context);
  },
};