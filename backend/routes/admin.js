import express from "express";
import * as adminController from "../controllers/adminController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import attachDbConnection from "../middleware/dbConnection.js";

const router = express.Router();

router.use(authenticateToken);
router.use(roleMiddleware(["admin"]));

// Database management routes
router.use(attachDbConnection("adminDb"));
router.get("/databases", adminController.getDatabases);
router.get("/databases/:dbName/collections", adminController.getCollections);
router.delete("/databases/:dbName", adminController.dropDatabase);
router.delete(
  "/databases/:dbName/collections/:collectionName",
  adminController.dropCollection,
);

// User management routes
router.post("/users", adminController.addUser);
router.get("/users", adminController.getUsers);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

export default router;
