import express from "express";
import * as eventsController from "../controllers/eventsController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import attachDbConnection from "../middleware/dbConnection.js";
import phaseMiddleware from "../middleware/phaseMiddleware.js";
import { checkFriendship } from "../middleware/friendshipMiddleware.js";

const router = express.Router();

// Authentifizierung sicherstellen
router.use(authenticateToken);
// Verbindung zur Datenbank herstellen
router.use(attachDbConnection("calendarDb"));

// Route für eigene Events (der authentifizierte Benutzer)
router.get("/events", phaseMiddleware, eventsController.getEvents);

// Route zum Erstellen eines neuen Events für den authentifizierten Benutzer
router.post("/events/:plantId", phaseMiddleware, eventsController.createEvent);

// Route zum Aktualisieren eines Events für den authentifizierten Benutzer
router.put("/events/:id", eventsController.updateEvent);

// Route zum Löschen eines Events für den authentifizierten Benutzer
router.delete("/events/:plantId", eventsController.deleteEvent);

// Route zum Überprüfen, ob ein Event für eine bestimmte Pflanze existiert
router.get("/events/:plantId/check", eventsController.checkPlantEvents);

// Route für die Events eines Freundes, wobei die Freundschaft überprüft wird
router.get("/friends/:friendId/events", checkFriendship, eventsController.getEvents);

export default router;
