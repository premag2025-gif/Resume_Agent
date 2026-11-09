import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  console.error(JSON.stringify({
    requestId: req.requestId,
    error: error instanceof Error ? error.message : "Unknown error"
  }));

  res.status(500).json({
    status: "error",
    requestId: req.requestId,
    errorCode: "INTERNAL_SERVER_ERROR",
    message: "Internal server error"
  });
};