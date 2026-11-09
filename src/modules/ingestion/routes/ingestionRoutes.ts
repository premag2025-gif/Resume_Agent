import { Router } from "express";
import { MulterError } from "multer";
import { resumeUpload, InvalidResumeFileError } from "../../../config/multerConfig";
import { getIngestionHealth, uploadResume } from "../controllers/ingestionController";

export const ingestionRoutes = Router();

ingestionRoutes.get("/resume/health", getIngestionHealth);

ingestionRoutes.post("/resume/upload", (req, res, next) => {
	resumeUpload.single("file")(req, res, (error: unknown) => {
		if (!error) {
			if (!req.file) {
				res.status(400).json({
					success: false,
					errorCode: "FILE_REQUIRED",
					message: "Resume PDF is required"
				});
				return;
			}

			next();
			return;
		}

		if (error instanceof InvalidResumeFileError) {
			res.status(415).json({
				success: false,
				errorCode: "INVALID_FILE_TYPE",
				message: "Only PDF files are allowed"
			});
			return;
		}

		if (error instanceof MulterError && error.code === "LIMIT_FILE_SIZE") {
			res.status(413).json({
				success: false,
				errorCode: "FILE_TOO_LARGE",
				message: "Resume exceeds maximum upload size"
			});
			return;
		}

		if (error instanceof MulterError) {
			res.status(400).json({
				success: false,
				errorCode: "INVALID_UPLOAD",
				message: "Resume upload is invalid"
			});
			return;
		}

		next(error);
	});
}, uploadResume);