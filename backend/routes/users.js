import express from "express";
import * as adminController from "../controllers/adminController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import attachDbConnection from "../middleware/dbConnection.js";

const router = express.Router();

router.use(authenticateToken);
router.use(roleMiddleware(["admin"]));

// Routes for database management
router.get(
  "/databases",
  attachDbConnection("adminDb"),
  adminController.getDatabases,
);
router.get(
  "/databases/:dbName/collections",
  attachDbConnection("adminDb"),
  adminController.getCollections,
);
router.delete(
  "/databases/:dbName",
  attachDbConnection("adminDb"),
  adminController.dropDatabase,
);
router.delete(
  "/databases/:dbName/collections/:collectionName",
  attachDbConnection("adminDb"),
  adminController.dropCollection,
);

// Routes for user management
router.post("/users", attachDbConnection("userDb"), adminController.addUser);
router.get("/users", attachDbConnection("userDb"), adminController.getUsers);
router.put(
  "/users/:id",
  attachDbConnection("userDb"),
  adminController.updateUser,
);
router.delete(
  "/users/:id",
  attachDbConnection("userDb"),
  adminController.deleteUser,
);

export default router;
