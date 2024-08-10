import express from "express";
import pageRoutes from "./pageRoutes.js";
import popupRoutes from "./popupRoutes.js";

const router = express.Router();

// Use the page routes
router.use("/", pageRoutes);

// Use the popup routes
router.use("/popup", popupRoutes);

export default router;
