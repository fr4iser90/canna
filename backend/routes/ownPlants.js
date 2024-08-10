import express from "express";
import * as ownPlantsController from "../controllers/ownPlantsController.js";
import * as recordsController from "../controllers/recordsController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import attachDbConnection from "../middleware/dbConnection.js";
import phaseMiddleware from '../middleware/phaseMiddleware.js';
import { upload, validateFile } from "../config/multerConfig.js";
import { archivePlant } from "../controllers/archivePlantController.js";
import * as phaseController from '../controllers/phaseController.js';

const router = express.Router();

// Attach the userstrain database connection
router.use(attachDbConnection("userstrainDb"));

// Routes for own plants
router.get("/", authenticateToken, phaseMiddleware, ownPlantsController.getOwnPlants);
router.post("/transitionPhase", authenticateToken, phaseController.transitionPlantPhase);
router.post("/cuttings", authenticateToken, ownPlantsController.createCuttings);
router.get('/:id', authenticateToken, phaseMiddleware, ownPlantsController.getOwnPlantById);
router.get("/friends", authenticateToken, ownPlantsController.getFriendsPlants);
router.post("/", authenticateToken, phaseMiddleware, ownPlantsController.createOwnPlant);
router.put("/:id", authenticateToken, phaseMiddleware, ownPlantsController.updateOwnPlant);
router.delete("/:id", authenticateToken, ownPlantsController.deleteOwnPlant);
router.post(
  "/:id/images",
  authenticateToken,
  upload.single("image"),
  validateFile,
  ownPlantsController.uploadPlantImage,
);
router.delete(
  "/:id/images/:imageId",
  authenticateToken,
  ownPlantsController.deletePlantImage,
);

// Routes for records
router.post(
  "/:id/nutrients",
  authenticateToken,
  recordsController.addNutrientRecord,
);
router.post("/:id/water", authenticateToken, recordsController.addWaterRecord);
router.post(
  "/:id/height",
  authenticateToken,
  recordsController.addHeightRecord,
);
router.post("/:id/width", authenticateToken, recordsController.addWidthRecord);
router.post(
  "/:id/rootDevelopment",
  authenticateToken,
  recordsController.addRootDevelopmentRecord,
);
router.post(
  "/:id/harvestWeight",
  authenticateToken,
  recordsController.addHarvestWeightRecord,
);

router.post("/archive/:id", authenticateToken, archivePlant);

// Phase start route
router.post('/startPhase', authenticateToken, phaseController.startPlantPhase);

export default router;
