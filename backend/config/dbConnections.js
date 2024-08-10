import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(path.dirname(""), "../../secrets/env/weedmongo.env"),
});

const connections = {};

async function connectWithRetry(
  uri,
  options,
  dbName,
  retries = 10,
  delay = 5000,
) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const connection = await mongoose.createConnection(uri, options);
        return connection;
    } catch (error) {
      console.error(
        `Attempt ${attempt + 1} to connect to ${dbName} failed:`,
        error.message,
      );
      attempt += 1;
      if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error(`Failed to connect to ${dbName} after ${retries} attempts`);
}

async function getConnection(dbName) {
  if (!connections[dbName]) {
    const uri = process.env[`MONGODB_URI_${dbName.toUpperCase()}`];
    if (!uri) {
      return;
    }

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true,
      tlsCAFile: path.resolve(path.dirname(""), "../app/certs/ca.pem"),
      tlsCertificateKeyFile: path.resolve(
        path.dirname(""),
        "../app/certs/mongodb-combined.pem",
      ),
      tlsAllowInvalidCertificates: true,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    };

    try {
      connections[dbName] = await connectWithRetry(uri, options, dbName);
    } catch (error) {
      console.error(`Error initializing connection for ${dbName}:`, error);
    }
  }
  return connections[dbName];
}

export { getConnection };
