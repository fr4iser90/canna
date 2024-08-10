import { getConnection } from "../config/dbConnections.js";
import createUserModel from "../models/User.js";

export const getProfile = async (req, res) => {
  console.log("getProfile called with:", req.user);
  try {
    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).send({ message: "Error loading profile" });
  }
};
