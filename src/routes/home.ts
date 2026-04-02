import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError";
import { getServiceName } from "../utils/logger";
import { randomInteger, sleep } from "../utils/delay";
import { renderSuccessPage } from "../utils/pages";

const FAILURE_RATE = 0.2;
const LATENCY_RATE = 0.35;

export async function homeHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const requestId = req.requestId ?? "system";

  try {
    const shouldAddLatency = Math.random() < LATENCY_RATE;
    const shouldFail = Math.random() < FAILURE_RATE;

    const startedAt = Date.now();

    if (shouldAddLatency) {
      await sleep(randomInteger(1000, 3000));
    }

    if (shouldFail) {
      throw new HttpError(500, "Simulated transient failure");
    }

    const latencyMs = Date.now() - startedAt;

    res.status(200).type("html").send(
      renderSuccessPage({
        requestId,
        serviceName: getServiceName(),
        latencyMs,
      }),
    );
  } catch (error) {
    next(error);
  }
}