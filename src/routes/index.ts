import { Router } from "express";
import { healthHandler } from "./health";
import { homeHandler } from "./home";

export function createRouter(): Router {
  const router = Router();

  router.get("/health", healthHandler);
  router.get("/", homeHandler);
  router.get("/favicon.ico", (_req, res) => {
    res.status(204).end();
  });

  return router;
}