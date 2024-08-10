import bcrypt from "bcrypt";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url"; // Import fileURLToPath for handling URLs in ES Modules
import createUserModel from "../models/User.js";
import createRoleModel from "../models/Role.js";

// Convert import.meta.url to file path using fileURLToPath
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, "../../secrets/env/weedmongo.env"),
});

// TLS options
const caPath = path.resolve(__dirname, "../certs/ca.pem");
const combinedPemPath = path.resolve(
  __dirname,
  "../certs/mongodb-combined.pem",
);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsCAFile: caPath,
  tlsCertificateKeyFile: combinedPemPath,
  tlsAllowInvalidCertificates: true,
};

// Utility function to connect to a database
async function connectToDatabase(uri) {
  try {
    const connection = await mongoose.createConnection(uri, options);
    console.log(`Connected to MongoDB at ${uri}`);
    return connection;
  } catch (err) {
    console.error(`Error connecting to MongoDB at ${uri}:`, err);
    process.exit(1); // Exit the process with an error code
  }
}

async function ensureRole(roleName, Role) {
  let role = await Role.findOne({ name: roleName });
  if (!role) {
    role = new Role({ name: roleName, permissions: [] });
    await role.save();
    console.log(`${roleName} role created`);
  } else {
    console.log(`${roleName} role already exists`);
  }
  return role;
}

async function ensureUser(
  userDbConnection,
  username,
  password,
  roleName,
  Role,
) {
  const User = createUserModel(userDbConnection);
  let user = await User.findOne({ username });
  let role = await Role.findOne({ name: roleName });

  if (!role) {
    role = await ensureRole(roleName, Role);
  }

  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      username,
      password: hashedPassword,
      email: `${username}@example.com`,
      roles: [role._id], // Assign role
    });
    await user.save();
    console.log(`${roleName} user created: ${username}`);
  } else {
    console.log(`${roleName} user already exists: ${username}`);
  }
}

async function ensureUsers() {
  try {
    const userDbUri = process.env.MONGODB_URI_USERDB;
    const userDbConnection = await connectToDatabase(userDbUri);

    const Role = createRoleModel(userDbConnection);
    if (!Role) {
      throw new Error(
        "Role model could not be created. Invalid connection object.",
      );
    }

    await Promise.all([
      ensureRole("moderator", Role),
      ensureRole("advancedUser", Role),
      ensureRole("normalUser", Role),
      ensureRole("restrictedUser", Role),
    ]);

    await Promise.all([
      ensureUser(
        userDbConnection,
        "moderator",
        process.env.MODERATOR_PASSWORD,
        "moderator",
        Role,
      ),
      ensureUser(
        userDbConnection,
        "advancedUser",
        process.env.ADVANCEDUSER_PASSWORD,
        "advancedUser",
        Role,
      ),
      ensureUser(
        userDbConnection,
        "normalUser",
        process.env.NORMALUSER_PASSWORD,
        "normalUser",
        Role,
      ),
      ensureUser(
        userDbConnection,
        "restrictedUser",
        process.env.RESTRICTEDUSER_PASSWORD,
        "restrictedUser",
        Role,
      ),
    ]);

    console.log("All users have been ensured.");
  } catch (err) {
    console.error("Error ensuring users:", err);
    process.exit(1); // Exit with an error code
  }
}

export default ensureUsers;
