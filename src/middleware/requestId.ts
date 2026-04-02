import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";

const REQUEST_ID_HEADER = "x-request-id";

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const incomingRequestId = req.header(REQUEST_ID_HEADER)?.trim();
  const requestId = incomingRequestId && incomingRequestId.length > 0 ? incomingRequestId : randomUUID();

  req.requestId = requestId;
  res.setHeader(REQUEST_ID_HEADER, requestId);

  next();
}