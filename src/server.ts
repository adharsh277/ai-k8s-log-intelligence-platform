import { createApp } from "./app";
import { logger, serializeError } from "./utils/logger";

const PORT = Number(process.env.PORT ?? "3000");
const app = createApp();

const server = app.listen(PORT, () => {
  logger.info("Server started", {
    requestId: "system",
    port: PORT,
    service: process.env.SERVICE_NAME?.trim() || "node-app",
  });
});

function shutdown(signal: NodeJS.Signals): void {
  logger.warn("Shutdown signal received", {
    requestId: "system",
    signal,
  });

  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", {
    requestId: "system",
    error: serializeError(error),
  });

  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection", {
    requestId: "system",
    error: serializeError(reason),
  });

  process.exit(1);
});