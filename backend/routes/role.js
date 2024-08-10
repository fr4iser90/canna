import express from "express";
import * as roleController from "../controllers/roleController.js";
import { createPermission } from "../controllers/permissionController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/role", authenticateToken, roleMiddleware(["admin"]), roleController.createRole);
router.post("/assign-role", authenticateToken, roleController.assignRoleToUser);
router.post("/permission", authenticateToken,roleMiddleware(["admin"]), createPermission);
router.get("/get", authenticateToken, roleController.getUserRole);

export default router;
