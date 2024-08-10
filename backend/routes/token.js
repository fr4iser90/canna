import express from "express";
import * as tokenController from "../controllers/tokenController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import attachDbConnection from "../middleware/dbConnection.js";

const router = express.Router();

// Stelle sicher, dass die Datenbankverbindung für den Benutzer hergestellt ist
router.use(attachDbConnection("userDb"));

// Token-Handling-Routen

// Route zum Aktualisieren des Zugriffstokens
router.post("/refresh", tokenController.refreshAccessToken);

// Route zur Überprüfung eines Zugriffstokens
router.get("/verifyToken", authenticateToken, tokenController.verifyToken);

// Route zum Widerrufen aller Tokens eines Benutzers (z.B. bei Passwortänderung)
router.post("/revokeTokensForUser", authenticateToken, tokenController.revokeTokensForUser);

// Route zur Invalidierung eines einzelnen Tokens (z.B. bei Sicherheitsverstoß)
router.post("/invalidateToken", authenticateToken, tokenController.invalidateToken);

export default router;
