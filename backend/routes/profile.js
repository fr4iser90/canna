import express from "express";
import { getProfile } from "../controllers/profileController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

// Authenticate all routes in this router
router.use(authenticateToken);

// Get user profile
router.get("/profile", getProfile);

export default router;
