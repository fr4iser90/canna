import dotenv from "dotenv";
dotenv.config();

import express from "express";
import initializePem from "./scripts/initializePem.js";
import initializeAndStartServer from "./scripts/initializeStartScript.js";

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await initializePem(); // Ensure PEM files are initialized first

    // Middleware configuration
    const middlewareConfig = (await import("./config/middlewareConfig.js")).default;
    middlewareConfig(app);

    // Routes configuration
    const routesConfig = (await import("./config/routesConfig.js")).default;
    routesConfig(app);

    // Error Handling Middleware
    const errorHandler = (await import("./middleware/errorHandler.js")).default;
    app.use(errorHandler);

    // Initialize and start the server
    await initializeAndStartServer(app, PORT);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();

export default app;
