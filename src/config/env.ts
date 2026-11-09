import dotenv from "dotenv";

dotenv.config();

const parsedPort = Number(process.env.PORT ?? 3000);
const parsedMaxUploadSizeMb = Number(process.env.MAX_UPLOAD_SIZE_MB ?? 5);

if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

if (!Number.isInteger(parsedMaxUploadSizeMb) || parsedMaxUploadSizeMb < 1) {
  throw new Error("MAX_UPLOAD_SIZE_MB must be a positive integer");
}

export const env = {
  port: parsedPort,
  nodeEnv: process.env.NODE_ENV ?? "development",
  mongodbUri: process.env.MONGODB_URI,
  mongodbDbName: process.env.MONGODB_DB_NAME ?? "resume_rag",
  maxUploadSizeMb: parsedMaxUploadSizeMb
};