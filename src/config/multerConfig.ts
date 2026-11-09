import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import multer from "multer";
import { env } from "./env";

const uploadDirectory = path.resolve(process.cwd(), "uploads");
mkdirSync(uploadDirectory, { recursive: true });

export class InvalidResumeFileError extends Error {}

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (_req, _file, callback) => {
    callback(null, `${randomUUID()}.pdf`);
  }
});

export const resumeUpload = multer({
  storage,
  limits: {
    fileSize: env.maxUploadSizeMb * 1024 * 1024
  },
  fileFilter: (_req, file, callback) => {
    const hasPdfExtension = path.extname(file.originalname).toLowerCase() === ".pdf";
    const hasPdfMimeType = file.mimetype.toLowerCase() === "application/pdf";

    if (!hasPdfExtension || !hasPdfMimeType) {
      callback(new InvalidResumeFileError("Only PDF files are allowed"));
      return;
    }

    callback(null, true);
  }
});