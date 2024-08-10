import bcrypt from "bcrypt";
import { getConnection } from "../config/dbConnections.js";
import createUserModel from "../models/User.js";
import createRoleModel from "../models/Role.js";
import dotenv from "dotenv";
import path from "path";
import * as tokenController from "./tokenController.js";

dotenv.config({ path: path.resolve("../../secrets/env/secrets.env") });

// Register a new user
export const register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);
    const Role = createRoleModel(dbConnection);
    

    // Check if there are any users already registered
    const existingUserCount = await User.countDocuments();
    console.log(`Existing user count: ${existingUserCount}`);

    // Determine the role of the new user
    let assignedRole;
    if (existingUserCount === 0) {
      // First user, assign the admin role
      assignedRole = await Role.findOne({ name: "admin" });
      if (!assignedRole) {
        assignedRole = new Role({ name: "admin" });
        await assignedRole.save();
        console.log("Admin role created and assigned to the first user");
      } else {
        console.log("Admin role already exists, assigning it to the first user");
      }
    } else {
      // Assign the role provided in the request or default to 'user'
      assignedRole = await Role.findOne({ name: role || "user" });
      if (!assignedRole) {
        assignedRole = new Role({ name: role || "user" });
        await assignedRole.save();
        console.log(`Role ${role || "user"} created and assigned to the new user`);
      } else {
        console.log(`Role ${role || "user"} already exists, assigning it to the new user`);
      }
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user with the assigned role
    const user = new User({
      username,
      password: hashedPassword,
      roles: [assignedRole._id], // Assign the user's role
    });

    await user.save();
    console.log(`User ${username} registered successfully with role ${assignedRole.name}`);

    res.status(201).json({ message: "User registered successfully", role: assignedRole.name });
  } catch (err) {
    console.error("Error registering user:", err.message);
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};

// Login a user
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = tokenController.generateAccessToken(user);
    const refreshToken = tokenController.generateRefreshToken(user);

    const authData = {
      accessToken,
      refreshToken,
      userId: user._id.toString(),
      role: user.roles,
    };

    res.cookie("authData", JSON.stringify(authData), {
      httpOnly: true,
      secure: true,
      maxAge: 7200000, // 2 hours
    });

    res.json({ message: "Login successful", ...authData });
  } catch (err) {
    console.error("Error logging in:", err.message);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};


// Logout a user
export const logout = async (req, res) => {
  const authData = req.cookies.authData
    ? JSON.parse(decodeURIComponent(req.cookies.authData))
    : null;
  const token = authData ? authData.accessToken : null;

  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  try {
    await tokenController.blacklistToken(token);
    res.clearCookie("authData"); // Clear the cookie
    res.status(200).send({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Error logging out:", err);
    res.status(500).send({ message: "Error logging out", error: err.message });
  }
};
