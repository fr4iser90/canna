import express from "express";
import * as strainDefinitionsController from "../controllers/strainDefinitionsController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import attachDbConnection from "../middleware/dbConnection.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(attachDbConnection("strainDb"));

router
  .route("/")
  .get(
    authenticateToken,
    strainDefinitionsController.getStrainDefinitions,
  )
  
  .post(
    authenticateToken,
    roleMiddleware(["admin", "moderator"]),
    strainDefinitionsController.createStrainDefinition,
  )
  .put(
    authenticateToken,
    roleMiddleware(["admin", "moderator"]),
    strainDefinitionsController.updateStrainDefinition,
  );

router.delete(
  "/:id",
  authenticateToken,
  roleMiddleware(["admin"]),
  strainDefinitionsController.deleteStrainDefinition,
);

router.get(
  "/:id",
  authenticateToken,
  strainDefinitionsController.getStrainDefinitionById
);

export default router;
