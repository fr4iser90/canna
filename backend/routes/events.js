import express from "express";
import * as eventsController from "../controllers/eventsController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import attachDbConnection from "../middleware/dbConnection.js";
import phaseMiddleware from "../middleware/phaseMiddleware.js";
import { checkFriendship } from "../middleware/friendshipMiddleware.js";

const router = express.Router();

router.use(authenticateToken);
router.use(attachDbConnection("calendarDb"));

router.get("/:userId/events", phaseMiddleware, checkFriendship, eventsController.getEvents);
router.post("/:userId/events/:plantId", phaseMiddleware, eventsController.createEvent);
router.put("/:userId/events/:id", eventsController.updateEvent);
router.delete("/:userId/events/:plantId", eventsController.deleteEvent);
router.get("/:userId/events/:plantId/check", eventsController.checkPlantEvents);

export default router;
