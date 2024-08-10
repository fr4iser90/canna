import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

const renderPage =
  (title, layout = "layouts/mainLayout") =>
  (req, res) => {
    res.render(`pages/${req.path.slice(1)}`, {
      title,
      nonce: res.locals.nonce,
      layout,
    });
  };

router.get("/login", renderPage("Login", false));
router.get("/calendar", authenticateToken, renderPage("Cannabis Calendar"));
router.get("/strains", authenticateToken, renderPage("Strain Definitions"));
router.get("/plants", authenticateToken, renderPage("Own Plants"));
router.get("/upload", authenticateToken, renderPage("File Upload"));
router.get("/admin", authenticateToken, roleMiddleware(["admin"]), renderPage("Admin Panel"));

export default router;
