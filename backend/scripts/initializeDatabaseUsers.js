
import { getDbClient } from './commonDbModule.js';
import path from "path";

// Function to initialize database users
export async function initializeDatabaseUsers() {
  const uri = process.env.MONGODB_URI_ADMINDB;
  const client = getDbClient(uri); // Verwende die importierte Funktion, um den MongoDB-Client zu erstellen

  try {
    await client.connect();
    const adminDb = client.db("admin");

    const createUserCommands = [
      {
        user: process.env.USERDB_USER,
        pwd: process.env.USERDB_PASSWORD,
        roles: [{ role: "readWrite", db: "userDb" }],
      },
      {
        user: process.env.CALENDARDB_USER,
        pwd: process.env.CALENDARDB_PASSWORD,
        roles: [{ role: "readWrite", db: "calendarDb" }],
      },
      {
        user: process.env.STRAINDB_USER,
        pwd: process.env.STRAINDB_PASSWORD,
        roles: [{ role: "readWrite", db: "strainDb" }],
      },
      {
        user: process.env.USERSTRAINDB_USER,
        pwd: process.env.USERSTRAINDB_PASSWORD,
        roles: [{ role: "readWrite", db: "userstrainDb" }],
      },
      {
        user: process.env.BLACKLISTDB_USER,
        pwd: process.env.BLACKLISTDB_PASSWORD,
        roles: [{ role: "readWrite", db: "blacklistDb" }],
      },
    ];

    for (const user of createUserCommands) {
      const existingUser = await adminDb.command({
        usersInfo: { user: user.user, db: "admin" },
      });

      if (existingUser.users.length === 0) {
        console.log(
          `Creating user: ${user.user} for database: ${user.roles[0].db}`
        );
        await adminDb.command({
          createUser: user.user,
          pwd: user.pwd,
          roles: user.roles,
        });
        console.log(`User created: ${user.user}`);
      } else {
        console.log(`User ${user.user} already exists. Skipping creation.`);
      }
    }

    console.log("All users are initialized successfully.");
  } catch (err) {
    console.error("Error executing init script:", err);
  } finally {
    await client.close();
  }
}

// For standalone execution
import { fileURLToPath } from "url"; // Importiere fileURLToPath, falls du das Skript standalone ausführst
const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (import.meta.url === fileURLToPath(import.meta.url)) {
  initializeDatabaseUsers();
}
