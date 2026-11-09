import cors from "cors";
import express from "express";
import { getDatabase } from "./config/database";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./middleware/logger";
import { requestId } from "./middleware/requestId";
import { ingestionRoutes } from "./modules/ingestion/routes/ingestionRoutes";

export const app = express();

app.use(requestId);
app.use(logger);
app.use(cors());
app.use(express.json());

app.get("/v1/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    app: "resume-rag-backend",
    version: "1.0.0",
    uptime: Number(process.uptime().toFixed(1))
  });
});

app.get("/v1/health/db", async (_req, res) => {
  const startedAt = Date.now();

  try {
    const database = await getDatabase();
    await database.command({ ping: 1 });
    database.collection("resumes");

    res.status(200).json({
      status: "ok",
      database: "mongodb",
      connected: true,
      latencyMs: Date.now() - startedAt
    });
  } catch {
    res.status(503).json({
      status: "error",
      database: "mongodb",
      connected: false,
      errorCode: "DB_CONNECTION_FAILED"
    });
  }
});

app.use("/v1", ingestionRoutes);

app.use(errorHandler);