import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getConnection } from "../config/dbConnections.js";
import createUserModel from "../models/User.js";
import createRoleModel from "../models/Role.js";
import { addTokenToBlacklist } from "../utils/blacklist.js";
import { generateTokens } from "../utils/tokenUtils.js";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("../../secrets/env/secrets.env") });

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

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

    const tokens = generateTokens(user);

    const authData = {
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: user._id.toString(),
      role: user.role,
    };
    res.cookie("authData", JSON.stringify(authData), {
      httpOnly: true,
      secure: true,
      maxAge: 7200000,
    }); // 1 hour

    res.json({ message: "Login successful", ...authData });
  } catch (err) {
    console.error("Error logging in:", err.message);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// Logout a user
export const logout = async (req, res) => {
  try {
    const authData = req.cookies.authData
      ? JSON.parse(decodeURIComponent(req.cookies.authData))
      : null;
    const token = authData ? authData.token : null;

    if (!token) {
      return res.status(401).send({ message: "No token provided" });
    }

    const decoded = jwt.decode(token);
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000); // Token lifespan in seconds
    await addTokenToBlacklist(token, expiresIn);
    res.clearCookie("authData"); // Clear the cookie
    res.status(200).send({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Error logging out:", err);
    res.status(500).send({ message: "Error logging out", error: err.message });
  }
};

// Refresh token
export const refreshToken = (req, res) => {
  const authData = req.cookies.authData
    ? JSON.parse(decodeURIComponent(req.cookies.authData))
    : null;
  const refreshToken = authData ? authData.refreshToken : null;

  if (!refreshToken) {
    return res.status(401).send({ message: "No refresh token provided" });
  }

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ message: "Invalid refresh token" });
    }

    const newTokens = generateTokens(user);
    authData.token = newTokens.accessToken;
    authData.refreshToken = newTokens.refreshToken;
    res.cookie("authData", JSON.stringify(authData), {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    }); // Set the new tokens as a cookie
    res.json({ token: newTokens.accessToken });
  });
};

const verifyTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

export const verifyToken = (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];

  if (authHeader) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies.authData) {
    const authData = JSON.parse(decodeURIComponent(req.cookies.authData));
    token = authData ? authData.token : null;
  }

  if (!token) {
    console.log("No token provided");
    return res.status(401).send({ valid: false });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification failed:", err.message);

      let authData;
      if (req.cookies.authData) {
        authData = JSON.parse(decodeURIComponent(req.cookies.authData));
      }
      const refreshToken = authData ? authData.refreshToken : null;

      if (refreshToken) {
        jwt.verify(refreshToken, REFRESH_SECRET, (refreshErr, refreshUser) => {
          if (refreshErr) {
            console.log(
              "Refresh token verification failed:",
              refreshErr.message,
            );
            return res.status(403).send({ valid: false });
          }

          const newTokens = generateTokens(refreshUser);
          authData.token = newTokens.accessToken;
          authData.refreshToken = newTokens.refreshToken;
          res.cookie("authData", JSON.stringify(authData), {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          });
          return res.send({
            valid: true,
            newToken: newTokens.accessToken,
            role: refreshUser.role,
          });
        });
      } else {
        return res.status(403).send({ valid: false });
      }
    } else {
      const newToken = jwt.sign(
        { username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" },
      );

      let authData;
      if (req.cookies.authData) {
        authData = JSON.parse(decodeURIComponent(req.cookies.authData));
        authData.token = newToken;
        res.cookie("authData", JSON.stringify(authData), {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
      } else {
        authData = { token: newToken, role: user.role };
        res.cookie("authData", JSON.stringify(authData), {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
      }

      console.log("Token verified successfully");
      res.send({ valid: true, newToken, role: user.role });
    }
  });
};
