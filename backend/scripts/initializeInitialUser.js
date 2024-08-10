import bcrypt from "bcrypt";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url"; 
import dotenv from "dotenv";
import createUserModel from "../models/User.js";
import createRoleModel from "../models/Role.js";
import { getConnection } from "../config/dbConnections.js";

// Convert import.meta.url to file path using fileURLToPath
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Lade die Anmeldeinformationen aus secrets.env
dotenv.config({
  path: path.resolve(__dirname, "../../secrets/env/secrets.env"),
});


// Function to ensure initial admin user
async function ensureInitialUser() {
  try {
    const userDbConnection = await getConnection("userDb");
    const User = createUserModel(userDbConnection);
    const Role = createRoleModel(userDbConnection);

    // Ensure the admin role exists
    let adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
      adminRole = new Role({ name: "admin", permissions: [] });
      await adminRole.save();
      console.log("Admin role created");
    } else {
      console.log("Admin role already exists");
    }

    // Ensure the initial admin user exists
    let user = await User.findOne({ username: process.env.USERNAME });
    if (!user) {
      const hashedPassword = await bcrypt.hash(process.env.PASSWORD, 10);
      user = new User({
        username: process.env.USERNAME,
        password: hashedPassword,
        email: `${process.env.USERNAME}@example.com`,
        roles: [adminRole._id], // Assign admin role
      });
      await user.save();
      console.log(`Initial admin user created: ${username}`);
    } else {
      if (!user.roles.includes(adminRole._id)) {
        user.roles.push(adminRole._id);
        await user.save();
        console.log(
          `Admin role assigned to existing user: ${user.username}`
        );
      } else {
        console.log(
          `Initial admin user already exists: ${user.username}`
        );
      }
    }
  } catch (err) {
    console.error("Error ensuring initial admin user exists:", err);
  }
}

export default ensureInitialUser;
