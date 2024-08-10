import jwt from "jsonwebtoken";
import { addTokenToBlacklist } from "../utils/blacklist.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

export const verifyToken = (token, type) => {
  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
    return decoded;
  } catch (err) {
    console.error(`Error verifying ${type} token:`, err.message);
    return null;
  }
};

export const refreshAccessToken = (refreshToken) => {
  try {
    const user = verifyToken(refreshToken, "refresh");
    if (!user) {
      throw new Error("Invalid refresh token");
    }
    return generateAccessToken(user);
  } catch (err) {
    console.error("Error refreshing access token:", err.message);
    throw err;
  }
};

export const blacklistToken = async (token) => {
  try {
    const decoded = jwt.decode(token);
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000); // Token lifespan in seconds
    await addTokenToBlacklist(token, expiresIn);
  } catch (err) {
    console.error("Error blacklisting token:", err.message);
    throw err;
  }
};

// Revoke all tokens for a specific user (e.g., upon password change or security breach)
export const revokeTokensForUser = async (userId) => {
  try {
    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);
    
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Invalidate all tokens by blacklisting them
    const tokensToInvalidate = user.tokens || [];
    for (const token of tokensToInvalidate) {
      await blacklistToken(token);
    }

    // Clear the user's token list (assuming you store them in the user document)
    user.tokens = [];
    await user.save();

    console.log(`All tokens revoked for user: ${userId}`);
  } catch (err) {
    console.error("Error revoking tokens for user:", err.message);
    throw err;
  }
};

// Invalidate token in case of violation or security breach
export const invalidateToken = async (token) => {
  try {
    await blacklistToken(token);
    console.log("Token invalidated due to violation or security breach");
  } catch (err) {
    console.error("Error invalidating token:", err.message);
    throw err;
  }
};

// Token blacklist management (remove expired tokens from blacklist)
export const manageTokenBlacklist = async () => {
  try {
    await removeExpiredTokens();
    console.log("Expired tokens removed from blacklist");
  } catch (err) {
    console.error("Error managing token blacklist:", err.message);
    throw err;
  }
};

// Function to handle token invalidation on password change
export const handlePasswordChange = async (userId) => {
  try {
    await revokeTokensForUser(userId);
    console.log(`All tokens invalidated due to password change for user: ${userId}`);
  } catch (err) {
    console.error("Error invalidating tokens on password change:", err.message);
    throw err;
  }
};