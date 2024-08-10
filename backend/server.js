import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

import initializeAndStartServer from "./scripts/initializeStartScript.js";

// Middleware configuration
import middlewareConfig from "./config/middlewareConfig.js";
middlewareConfig(app);

// Routes configuration
import routesConfig from "./config/routesConfig.js";
routesConfig(app);

// Error Handling Middleware
import errorHandler from "./middleware/errorHandler.js";
app.use(errorHandler);

initializeAndStartServer(app, PORT);

export default app;
