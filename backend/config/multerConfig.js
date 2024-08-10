import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import { fileTypeFromBuffer } from "file-type";

// Set storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure absolute path for security
    cb(null, path.join(path.dirname(import.meta.url), "uploads/"));
  },
  filename: function (req, file, cb) {
    // Sanitize the filename to prevent any exploits
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

// File filter to allow only specific types
const fileFilter = (req, file, cb) => {
  // Accept image files only
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only image files are allowed."), false);
  }
};

// Middleware to validate file content
const validateFile = async (req, res, next) => {
  if (!req.file) {
    return next(new Error("No file uploaded"));
  }
  try {
    const filePath = path.join(
      path.dirname(import.meta.url),
      "uploads",
      req.file.filename,
    );
    const buffer = await fs.readFile(filePath);
    const type = await fileTypeFromBuffer(buffer);

    if (!type || !type.mime.startsWith("image/")) {
      await fs.unlink(filePath); // Delete the invalid file
      return next(new Error("Invalid file content"));
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Set limits for the file size
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export { upload, validateFile };
