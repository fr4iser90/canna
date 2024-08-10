import express from "express";
import * as authController from "../controllers/authController.js";
import attachDbConnection from "../middleware/dbConnection.js";

const router = express.Router();

router.use(attachDbConnection("userDb"));

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/register", authController.register);

export default router;
