import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

// // __dirname resolution for ESM or TS projects:
// const __dirname = path.resolve();

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, "public");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req: Request, file, cb) => {
    cb(null, file.originalname);
  },
});

// Multer upload middleware
export const upload = multer({
  storage,
});
