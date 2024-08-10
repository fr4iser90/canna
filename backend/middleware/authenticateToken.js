import jwt from "jsonwebtoken";
import { getConnection } from "../config/dbConnections.js";
import createUserModel from "../models/User.js";
import { isTokenBlacklisted } from "../utils/blacklist.js";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url"; // Import fileURLToPath for handling URLs in ES Modules

// Convert import.meta.url to file path using fileURLToPath
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, "../../secrets/env/secrets.env"),
});

const JWT_SECRET = process.env.JWT_SECRET;

export async function authenticateToken(req, res, next) {
  let token;
  const authHeader = req.headers["authorization"];

  if (authHeader) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies.authData) {
    const authData = JSON.parse(decodeURIComponent(req.cookies.authData));
    token = authData ? authData.token : null;
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied: No token provided" });
  }

  if (await isTokenBlacklisted(token)) {
    return res
      .status(403)
      .json({ message: "Access denied: Token is blacklisted" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);

    const dbUser = await User.findById(decoded._id).populate("roles");
    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = {
      _id: dbUser._id,
      username: dbUser.username,
      roles: dbUser.roles.map((role) => role.name),
    };

    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token", error: err.message });
  }
}
