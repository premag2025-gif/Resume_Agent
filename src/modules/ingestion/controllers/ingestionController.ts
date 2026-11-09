import { RequestHandler } from "express";

export const getIngestionHealth: RequestHandler = (_req, res) => {
  res.status(200).json({
    status: "ok",
    module: "resume-ingestion"
  });
};

export const uploadResume: RequestHandler = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Resume uploaded successfully",
    file: {
      originalName: req.file!.originalname,
      mimeType: req.file!.mimetype,
      size: req.file!.size
    }
  });
};