import multer from "multer";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

// Manually define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define storage using Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../Public/Images"));
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(12, (err, buffer) => {
      if (err) {
        return cb(err, "");
      }
      const uniqueFilename = `${buffer.toString("hex")}${path.extname(
        file.originalname
      )}`;
      cb(null, uniqueFilename);
    });
  },
});

// File filter (Optional - Only allow images)
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type! Only images are allowed."));
  }
};

// Multer upload configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
});
