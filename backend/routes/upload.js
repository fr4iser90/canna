import express from "express";
import { uploadFile } from "../controllers/uploadController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import attachDbConnection from "../middleware/dbConnection.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Route for file upload with authentication, role authorization, and DB connection
router.post(
  "/upload",
  authenticateToken,
  attachDbConnection("userstrainDb"),
  roleMiddleware(["admin", "moderator", "advancedUser"]),
  uploadFile,
);

export default router;
