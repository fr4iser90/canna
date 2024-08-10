import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import attachDbConnection from "../middleware/dbConnection.js";

const router = express.Router();

// Route für die Testseite
router.get("/test", (req, res) => {
  res.render("test", { title: "Token Test Page", nonce: res.locals.nonce });
});

// Route für das Abrufen der Benutzerrolle
router.get("/getUserRole", authenticateToken, async (req, res) => {
  try {
    const user = req.user; // Angenommen, `authenticateToken` setzt `req.user`
    if (!user || !user.roles) {
      return res.status(400).json({ message: "User roles not found" });
    }
    res.json({ roles: user.roles });
  } catch (error) {
    console.error("Error fetching user role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Middleware für die Datenbankverbindung zur Benutzerdatenbank
router.use("/randomPlants", attachDbConnection("strainDb"));

// Route für das Abrufen zufälliger Pflanzen
router.get("/randomPlants", authenticateToken, async (req, res) => {
  try {
    const plants = await req.db
      .model("Plant")
      .aggregate([{ $sample: { size: 5 } }]); // 5 zufällige Pflanzen auswählen
    res.json(plants);
  } catch (error) {
    console.error("Error fetching random plants:", error);
    res.status(500).json({ message: "Error fetching random plants" });
  }
});

// Middleware für die Datenbankverbindung zur Benutzerdatenbank
router.use("/getUserRoleFromDb", attachDbConnection("userDb"));

// Route für das Abrufen der Benutzerrolle aus der Datenbank
router.get("/getUserRoleFromDb", authenticateToken, async (req, res) => {
  try {
    const user = await req.db.model("User").findById(req.user._id);
    if (user) {
      res.json({ role: user.role });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user role from database:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
