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

// Read the private and public keys
const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const publicKey = fs.readFileSync(publicKeyPath, "utf8");

export const generateAccessToken = (user) => {
  try {
    console.log("Generating Access Token for user:", user.username);
    const token = jwt.sign(
      { _id: user._id, username: user.username, roles: user.roles },
      { key: privateKey, passphrase: process.env.JWT_SECRET },  // Decrypt private key with passphrase
      { algorithm: "RS256", expiresIn: "1h" }
    );

    console.log("Generated Access Token:", token);
    return token;
  } catch (error) {
    console.error("Error generating access token for user:", user.username, "-", error.message);
    throw new Error("Token generation failed");
  }
};

export const generateRefreshToken = (user) => {
  try {
    console.log("Generating Refresh Token for user:", user.username);
    const token = jwt.sign(
      { _id: user._id, username: user.username, roles: user.roles },
      { key: privateKey, passphrase: process.env.JWT_SECRET },  // Decrypt private key with passphrase
      { algorithm: "RS256", expiresIn: "7d" }
    );

    console.log("Generated Refresh Token:", token);
    return token;
  } catch (error) {
    console.error("Error generating refresh token for user:", user.username, "-", error.message);
    throw new Error("Token generation failed");
  }
};

export const verifyToken = (token, type) => {
  try {
    console.log(`Verifying ${type} token. Token: ${token}`);

    // Ensure token is a string
    if (typeof token !== 'string') {
      console.error(`Token verification failed: Token must be a string. Received: ${typeof token}`);
      throw new Error("Token must be a string");
    }

    const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
    console.log(`${type} token successfully verified. Decoded token:`, decoded);
    return decoded;
  } catch (err) {
    console.error(`Error verifying ${type} token. Token: ELENDIG LANG - Error: ${err.message}`);
    return null;
  }
};

export const refreshAccessToken = (refreshToken) => {
  try {
    console.log("Refreshing access token with refresh token:", refreshToken);
    const user = verifyToken(refreshToken, "refresh");
    if (!user) {
      console.error("Invalid refresh token:", refreshToken);
      throw new Error("Invalid refresh token");
    }
    const newAccessToken = generateAccessToken(user);
    console.log("New access token generated:", newAccessToken);
    return newAccessToken;
  } catch (err) {
    console.error("Error refreshing access token. Refresh token:", refreshToken, "- Error:", err.message);
    throw err;
  }
};

export const blacklistToken = async (token) => {
  try {
    console.log("Blacklisting token:", token);
    if (typeof token !== 'string') {
      console.error("Token must be a string before blacklisting. Received:", typeof token);
      throw new Error("Token must be a string before blacklisting");
    }
    const decoded = jwt.decode(token);
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000); // Token lifespan in seconds
    await addTokenToBlacklist(token, expiresIn);
    console.log("Token successfully blacklisted:");
  } catch (err) {
    console.error("Error blacklisting token:", "- Error:", err.message);
    throw err;
  }
};

// Revoke all tokens for a specific user (e.g., upon password change or security breach)
export const revokeTokensForUser = async (userId) => {
  try {
    console.log(`Revoking all tokens for user: ${userId}`);
    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);

    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found for revoking tokens. UserID:", userId);
      throw new Error("User not found");
    }

    // Invalidate all tokens by blacklisting them
    const tokensToInvalidate = user.tokens || [];
    for (const token of tokensToInvalidate) {
      console.log("Blacklisting token for user:", userId);
      await blacklistToken(token);
    }

    // Clear the user's token list (assuming you store them in the user document)
    user.tokens = [];
    await user.save();
    console.log(`All tokens revoked and cleared for user: ${userId}`);
  } catch (err) {
    console.error(`Error revoking tokens for user: ${userId} - Error:`, err.message);
    throw err;
  }
};

// Invalidate token in case of violation or security breach
export const invalidateToken = async (token) => {
  try {
    console.log("Invalidating token due to violation or security breach. Token:", token);
    await blacklistToken(token);
    console.log("Token invalidated successfully. Token:");
  } catch (err) {
    console.error("Error invalidating token:", "- Error:", err.message);
    throw err;
  }
};

// Token blacklist management (remove expired tokens from blacklist)
export const manageTokenBlacklist = async () => {
  try {
    console.log("Managing token blacklist. Removing expired tokens...");
    await removeExpiredTokens();
    console.log("Expired tokens removed from blacklist.");
  } catch (err) {
    console.error("Error managing token blacklist:", err.message);
    throw err;
  }
};

// Function to handle token invalidation on password change
export const handlePasswordChange = async (userId) => {
  try {
    console.log(`Handling password change for user: ${userId}. Revoking all tokens...`);
    await revokeTokensForUser(userId);
    console.log(`All tokens invalidated due to password change for user: ${userId}`);
  } catch (err) {
    console.error(`Error invalidating tokens on password change for user: ${userId} - Error:`, err.message);
    throw err;
  }
};
