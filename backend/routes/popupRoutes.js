import express from "express";
import * as popupController from "../controllers/popupController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import attachDbConnection from "../middleware/dbConnection.js";

const router = express.Router();

// Middleware für die Datenbankverbindung
const attachUserstrainDb = attachDbConnection("userstrainDb");
const attachStrainDb = attachDbConnection("strainDb");
const attachUsersDb = attachDbConnection("userDb");

// Plant Details Popup Route
router.get("/plantEventPopup", authenticateToken, attachUserstrainDb, popupController.renderPlantDetailsPopup);

// Record Details Popup Route
router.get("/record", authenticateToken, attachUserstrainDb, popupController.renderRecordDetailsPopup);

// Strain Own Plant Popup Route
router.get("/strainOwnPlantPopup", authenticateToken, attachStrainDb, popupController.getStrainPopupData);

// Delete Confirmation Popup Route
//router.get("/confirm-delete/:id", authenticateToken, attachUserstrainDb, popupController.renderDeleteConfirmationPopup);

// Manage Plant Popup Route
router.get("/manage-plant/:id", authenticateToken, attachUserstrainDb, popupController.renderManageOwnPlantPopup);

// Friend Search Popup Route
router.get("/friendSearchPopup", authenticateToken, attachUsersDb, popupController.renderFriendSearchPopup);


export default router;
