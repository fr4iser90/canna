import { getConnection } from "../config/dbConnections.js";
import bcrypt from "bcrypt";
import createUserModel from "../models/User.js";

// Fetch all databases
export const getDatabases = async (req, res) => {
  try {
    const adminDbConnection = await getConnection("adminDb");
    const admin = adminDbConnection.db.admin();
    const databases = await admin.listDatabases();
    res.json(databases.databases);
  } catch (err) {
    console.error("Error fetching databases:", err);
    res
      .status(500)
      .send({ message: "Error fetching databases", error: err.message });
  }
};

// Fetch all collections in a database
export const getCollections = async (req, res) => {
  const { dbName } = req.params;
  if (["admin", "local", "config"].includes(dbName)) {
    return res
      .status(403)
      .send({ message: "Access to this database is restricted" });
  }
  try {
    const dbConnection = await getConnection(dbName);
    const db = dbConnection.useDb(dbName);
    const collections = await db.db.listCollections().toArray();
    res.json(collections);
  } catch (err) {
    console.error(`Error fetching collections for database ${dbName}:`, err);
    res.status(500).send({
      message: `Error fetching collections for database ${dbName}`,
      error: err.message,
    });
  }
};

// Drop a database
export const dropDatabase = async (req, res) => {
  const { dbName } = req.params;
  if (["admin", "local", "config"].includes(dbName)) {
    return res
      .status(403)
      .send({ message: "Dropping this database is not allowed" });
  }
  try {
    const dbConnection = await getConnection(dbName);
    const db = dbConnection.useDb(dbName);
    await db.dropDatabase();
    res.send({ message: `Database ${dbName} dropped successfully` });
  } catch (err) {
    console.error(`Error dropping database ${dbName}:`, err);
    res.status(500).send({
      message: `Error dropping database ${dbName}`,
      error: err.message,
    });
  }
};

// Drop a collection
export const dropCollection = async (req, res) => {
  const { dbName, collectionName } = req.params;
  if (["admin", "local", "config"].includes(dbName)) {
    return res.status(403).send({
      message: "Dropping collections in this database is not allowed",
    });
  }
  try {
    const dbConnection = await getConnection(dbName);
    const db = dbConnection.useDb(dbName);
    await db.collection(collectionName).drop();
    res.send({
      message: `Collection ${collectionName} in database ${dbName} dropped successfully`,
    });
  } catch (err) {
    console.error(
      `Error dropping collection ${collectionName} in database ${dbName}:`,
      err,
    );
    res.status(500).send({
      message: `Error dropping collection ${collectionName} in database ${dbName}`,
      error: err.message,
    });
  }
};

// Add a new user
export const addUser = async (req, res) => {
  try {
    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      role: req.body.role,
    });
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).send({ message: "Error adding user" });
  }
};

// Fetch all users
export const getUsers = async (req, res) => {
  try {
    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send({ message: "Error fetching users" });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  try {
    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send({ message: "Error updating user" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send({ message: "Error deleting user" });
  }
};
