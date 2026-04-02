import express from "express";
import { errorHandler } from "./middleware/errorHandler";
import { requestIdMiddleware } from "./middleware/requestId";
import { requestLoggerMiddleware } from "./middleware/requestLogger";
import { createRouter } from "./routes";

export function createApp(): express.Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(requestIdMiddleware);
  app.use(requestLoggerMiddleware);
  app.use(createRouter());
  app.use(errorHandler);

  return app;
}