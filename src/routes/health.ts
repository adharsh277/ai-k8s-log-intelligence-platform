import type { Request, Response } from "express";
import { getServiceName } from "../utils/logger";

export function healthHandler(req: Request, res: Response): void {
  res.status(200).json({
    status: "ok",
    service: getServiceName(),
    requestId: req.requestId ?? "system",
    uptimeSeconds: Number(process.uptime().toFixed(2)),
  });
}