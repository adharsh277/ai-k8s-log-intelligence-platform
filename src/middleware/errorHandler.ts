import type { ErrorRequestHandler } from "express";
import { isHttpError } from "../utils/httpError";
import { logger, serializeError } from "../utils/logger";
import { renderErrorPage } from "../utils/pages";

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const requestId = req.requestId ?? "system";
  const statusCode = isHttpError(error) ? error.statusCode : 500;
  const message = error instanceof Error ? error.message : "Unexpected error";

  logger.error(statusCode >= 500 ? "Internal server error" : message, {
    requestId,
    statusCode,
    error: serializeError(error),
  });

  if (res.headersSent) {
    return;
  }

  res.status(statusCode).type("html").send(
    renderErrorPage({
      requestId,
      serviceName: process.env.SERVICE_NAME?.trim() || "node-app",
      message,
    }),
  );
};