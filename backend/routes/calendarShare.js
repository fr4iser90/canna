import express from "express";
import * as calendarShareController from "../controllers/calendarShareController.js";
import * as eventsController from "../controllers/eventsController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import attachDbConnection from "../middleware/dbConnection.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { checkFriendship } from "../middleware/friendshipMiddleware.js"

const router = express.Router();

// Attach the calendar database connection and initialize CalendarShare model
router.use(attachDbConnection("calendarDb", "CalendarShare"));

// Share a calendar
router.post(
  "/",
  authenticateToken,
  calendarShareController.shareCalendar,
);

// Get shares for a calendar
router.get(
  "/:userId/events",
  authenticateToken,
  checkFriendship,
  eventsController.getEvents,
);

export default router;
