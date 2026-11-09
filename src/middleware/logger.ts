import { RequestHandler } from "express";

export const logger: RequestHandler = (req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    console.log(JSON.stringify({
      requestId: req.requestId,
      method: req.method,
      endpoint: req.path,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt
    }));
  });

  next();
};