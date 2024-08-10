import express from "express";
import * as authController from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import attachDbConnection from "../middleware/dbConnection.js";

const router = express.Router();

router.use(attachDbConnection("userDb"));

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", authenticateToken, authController.logout);
router.post("/refresh", authController.refreshToken);
router.get("/verifyToken", authController.verifyToken);

export default router;
