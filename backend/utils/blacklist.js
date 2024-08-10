import { getConnection } from "../config/dbConnections.js";

async function addTokenToBlacklist(token, expiresIn) {
  try {
    const dbConnection = await getConnection("blacklistDb");
    const collection = dbConnection.collection("blacklist");
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    await collection.insertOne({ token, expiresAt });
    console.log(`Token added to blacklist with expiration at ${expiresAt}`);
  } catch (err) {
    console.error("Error adding token to blacklist:", err);
  }
}

async function isTokenBlacklisted(token) {
  try {
    const dbConnection = await getConnection("blacklistDb");
    const collection = dbConnection.collection("blacklist");

    // Clean up expired tokens before checking
    await collection.deleteMany({ expiresAt: { $lte: new Date() } });

    const tokenDoc = await collection.findOne({ token });
    const isBlacklisted = tokenDoc !== null;

    console.log(`Token ${token} blacklisted: ${isBlacklisted}`);
    return isBlacklisted;
  } catch (err) {
    console.error("Error checking token blacklist status:", err);
    return false;
  }
}

export { addTokenToBlacklist, isTokenBlacklisted };
