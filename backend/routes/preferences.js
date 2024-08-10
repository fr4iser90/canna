import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import attachDbConnection from "../middleware/dbConnection.js";
import {
  getUserPreferences,
  updateUserPreferences,
} from "../controllers/preferencesController.js";

const router = express.Router();

// Attach the user database connection
router.use(attachDbConnection("userDb"));

// Route to get user preferences
router.get("/:userId", authenticateToken, getUserPreferences);

// Route to update user preferences
router.put("/", authenticateToken, updateUserPreferences);

export default router;
