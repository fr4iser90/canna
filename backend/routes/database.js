import express from "express";
import * as adminController from "../controllers/adminController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import attachDbConnection from "../middleware/dbConnection.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Attach the admin database connection
router.use(attachDbConnection("adminDb"));

// Fetch all databases
router.get(
  "/database",
  authenticateToken,
  roleMiddleware(["admin"]),
  adminController.listDatabases,
);

// Create a new database entry
router.post(
  "/database",
  authenticateToken,
  roleMiddleware(["admin"]),
  adminController.createDatabaseEntry,
);

// Delete a database
router.delete(
  "/database",
  authenticateToken,
  roleMiddleware(["admin"]),
  adminController.dropDatabase,
);

export default router;
