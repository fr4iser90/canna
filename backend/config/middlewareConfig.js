import helmet from "./helmetConfig.js";
import nonceMiddleware from "../middleware/nonceMiddleware.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "./corsConfig.js";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import express from "express";

export default (app) => {
  // Set the view engine to EJS
  app.set("view engine", "ejs");

  // Obtain the directory name using import.meta.url
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  app.set("views", path.join(__dirname, "../views"));

  // Use express-ejs-layouts
  app.use(expressLayouts);
  app.set("layout", "layouts/layout");

  // Middleware
  app.use(nonceMiddleware);
  app.use(helmet());
  app.use(cors);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Serve static files
  app.use(express.static(path.join(__dirname, "../public")));
};
