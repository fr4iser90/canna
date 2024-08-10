import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const privateKeyPath = path.resolve(__dirname, "../../secrets/keys/private.pem");
const publicKeyPath = path.resolve(__dirname, "../../secrets/keys/public.pem");

const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const publicKey = fs.readFileSync(publicKeyPath, "utf8");

export const generateAccessToken = (user) => {
  return jwt.sign(
    { _id: user._id, username: user.username, roles: user.roles },
    privateKey,
    { algorithm: "RS256", expiresIn: "1h" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { _id: user._id, username: user.username, roles: user.roles },
    privateKey,
    { algorithm: "RS256", expiresIn: "7d" }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, publicKey, { algorithms: ["RS256"] });
};
