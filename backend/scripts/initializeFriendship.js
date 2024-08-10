import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url"; // Import fileURLToPath for handling URLs in ES Modules
import dotenv from "dotenv";
import createFriendshipModel from "../models/Friendship.js";
import createUserModel from "../models/User.js";
import createRoleModel from "../models/Role.js";

// Convert import.meta.url to file path using fileURLToPath
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, "../../secrets/env/secrets.env"),
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

// Function to send a friend request
async function sendFriendRequest(sender, receiver, Friendship) {
  try {
    const existingRequest = await Friendship.findOne({
      user1: sender._id,
      user2: receiver._id,
    });

    if (!existingRequest) {
      const friendRequest = new Friendship({
        user1: sender._id,
        user2: receiver._id,
        status: "accepted",
      });
      await friendRequest.save();
      console.log(
        `Friend request sent from ${sender.username} to ${receiver.username}`,
      );
    } else {
      console.log(
        `Friend request already exists from ${sender.username} to ${receiver.username}`,
      );
    }
  } catch (err) {
    console.error(
      `Error sending friend request from ${sender.username} to ${receiver.username}:`,
      err,
    );
  }
}

// Function to ensure friendships between users
async function ensureFriendship() {
  try {
    const userDbUri = process.env.MONGODB_URI_USERDB;
    const userDbConnection = await connectToDatabase(userDbUri);

    const User = createUserModel(userDbConnection);
    const Role = createRoleModel(userDbConnection);
    const Friendship = createFriendshipModel(userDbConnection);

    const roleNames = [
      "moderator",
      "advancedUser",
      "normalUser",
      "restrictedUser",
    ];
    const users = [];

    for (const roleName of roleNames) {
      const role = await Role.findOne({ name: roleName });
      if (role) {
        const user = await User.findOne({ roles: role._id });
        if (user) {
          users.push(user);
        }
      }
    }

    if (users.length < roleNames.length) {
      console.error("Not all users found, cannot create friendship");
      return;
    }

    console.log("Ensuring friendships...");

    // Create friendships between all pairs of users
    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        await sendFriendRequest(users[i], users[j], Friendship);
        await sendFriendRequest(users[j], users[i], Friendship);
      }
    }

    // Create friendships between remaining users and existing users
    const allUsers = await User.find({
      username: { $nin: users.map((user) => user.username) },
    });

    for (const user of allUsers) {
      for (const existingUser of users) {
        await sendFriendRequest(existingUser, user, Friendship);
        await sendFriendRequest(user, existingUser, Friendship);
      }
    }
  } catch (err) {
    console.error("Error ensuring friendship exists:", err);
  }
}

export default ensureFriendship;
