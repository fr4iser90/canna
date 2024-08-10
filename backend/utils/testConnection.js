import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, "../../secrets/env/secrets.env"),
});

const caPath = path.resolve(__dirname, "../app/certs/ca.pem");
const combinedPemPath = path.resolve(
  __dirname,
  "../app/certs/mongodb-combined.pem",
);

// Logging: Output the paths to the CA and combined PEM files
console.log("CA Path:", caPath);
console.log("Combined PEM Path:", combinedPemPath);

if (!fs.existsSync(caPath) || !fs.existsSync(combinedPemPath)) {
  console.error("CA file or Combined PEM file not found.");
  process.exit(1);
}

const options = {
  tls: true,
  tlsCAFile: caPath,
  tlsCertificateKeyFile: combinedPemPath,
  tlsAllowInvalidCertificates: true,
};

// Logging: Output the loaded environment variables
console.log("Loaded Environment Variables:");
console.log("MONGODB_URI_USERDB:", process.env.MONGODB_URI_USERDB);
console.log("MONGODB_URI_CALENDARDB:", process.env.MONGODB_URI_CALENDARDB);
console.log("MONGODB_URI_STRAINDB:", process.env.MONGODB_URI_STRAINDB);
console.log("MONGODB_URI_USERSTRAINDB:", process.env.MONGODB_URI_USERSTRAINDB);

if (!process.env.MONGODB_URI_USERDB) {
  console.error("MONGODB_URI_USERDB is not defined in environment variables.");
  process.exit(1);
}

// Manually set the IP address for mongo
const mongoIP = "172.30.0.2"; // replace this with the correct IP address

// Replace 'mongo' with the actual IP address while keeping the URI schema
const userDbUri = process.env.MONGODB_URI_USERDB.replace(
  "@mongo",
  `@${mongoIP}`,
);
console.log("MongoDB URI:", userDbUri);

async function testConnection() {
  const client = new MongoClient(userDbUri, options);

  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    console.error("Full Error:", error);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

testConnection();
