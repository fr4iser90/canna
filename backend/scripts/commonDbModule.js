
import path from "path";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../secrets/env/weedmongo.env") });

const caPath = path.resolve(__dirname, "../certs/ca.pem");
const combinedPemPath = path.resolve(__dirname, "../certs/mongodb-combined.pem");

const options = {
  tls: true,
  tlsCAFile: caPath,
  tlsCertificateKeyFile: combinedPemPath,
  tlsAllowInvalidCertificates: true,
};

export function getDbClient(uri) {
  if (!uri) {
    console.error("MongoDB URI is not defined in the .env file.");
    process.exit(1);
  }
  return new MongoClient(uri, options);
}
