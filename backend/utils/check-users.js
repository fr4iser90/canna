import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, "../../secrets/env/secrets.env"),
});

const caPath = path.resolve(__dirname, "../../secrets/ca.pem");
const combinedPemPath = path.resolve(
  __dirname,
  "../../secrets/mongodb-combined.pem",
);

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

async function checkUsers() {
  const uri = process.env.MONGODB_URI_ADMINDB;
  const client = new MongoClient(uri, options);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const adminDb = client.db("admin");

    const userDbUser = await adminDb.command({
      usersInfo: { user: process.env.USERDB_USER, db: "userDb" },
    });
    console.log("userDbUser:", userDbUser);

    const calendarDbUser = await adminDb.command({
      usersInfo: { user: process.env.CALENDARDB_USER, db: "calendarDb" },
    });
    console.log("calendarDbUser:", calendarDbUser);

    const strainDbUser = await adminDb.command({
      usersInfo: { user: process.env.STRAINDB_USER, db: "strainDb" },
    });
    console.log("strainDbUser:", strainDbUser);

    const userstrainDbUser = await adminDb.command({
      usersInfo: { user: process.env.USERSTRAINDB_USER, db: "userstrainDb" },
    });
    console.log("userstrainDbUser:", userstrainDbUser);

    const blacklistDbUser = await adminDb.command({
      usersInfo: { user: process.env.BLACKLISTDB_USER, db: "blacklistDb" },
    });
    console.log("blacklistDbUser:", blacklistDbUser);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

checkUsers();
