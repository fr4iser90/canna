import { getConnection } from "../config/dbConnections.js";
import createRoleModel from "../models/Role.js";
import createPermissionModel from "../models/Permission.js";
import createUserModel from "../models/User.js";

export const createRole = async (req, res) => {
  const { name, permissions } = req.body;
  try {
    const dbConnection = await getConnection("userDb");
    const Role = createRoleModel(dbConnection);
    const Permission = createPermissionModel(dbConnection);

    const permissionDocs = await Permission.find({
      name: { $in: permissions },
    });
    const newRole = new Role({
      name,
      permissions: permissionDocs.map((p) => p._id),
    });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const assignRoleToUser = async (req, res) => {
  const { username, roleName } = req.body;
  try {
    const dbConnection = await getConnection("userDb");
    const Role = createRoleModel(dbConnection);
    const User = createUserModel(dbConnection);

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const role = await Role.findOne({ name: roleName }).populate("permissions");
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Check if the role is already assigned
    if (user.roles.includes(role._id)) {
      return res.status(400).json({ message: "User already has this role" });
    }

    user.roles.push(role._id);
    await user.save();

    res.json({ message: "Role assigned", user });
  } catch (error) {
    console.error("Error assigning role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserRole = async (req, res) => {
  try {
    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);

    const user = await User.findById(req.user._id).populate('roles');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const roles = user.roles.map(role => role.name);
    res.json({ roles });
  } catch (error) {
    console.error("Error fetching user roles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};