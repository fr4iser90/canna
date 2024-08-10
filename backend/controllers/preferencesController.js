import { getConnection } from "../config/dbConnections.js";
import createUserPreferencesModel from "../models/UserPreferences.js";

export const getUserPreferences = async (req, res) => {
  let dbConnection;
  try {
    dbConnection = await getConnection("userDb");
    const UserPreferences = createUserPreferencesModel(dbConnection);

    let preferences = await UserPreferences.findOne({
      userId: req.params.userId,
    });
    if (!preferences) {
      preferences = new UserPreferences({ userId: req.params.userId });
      await preferences.save();
    }
    res.status(200).json(preferences);
  } catch (err) {
    console.error("Error retrieving preferences:", err);
    res
      .status(500)
      .json({ message: "Error retrieving preferences", error: err.message });
  }
};

export const updateUserPreferences = async (req, res) => {
  let dbConnection;
  try {
    dbConnection = await getConnection("userDb");
    const UserPreferences = createUserPreferencesModel(dbConnection);

    const preferences = await UserPreferences.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true, upsert: true },
    );
    res.status(200).json(preferences);
  } catch (err) {
    console.error("Error updating preferences:", err);
    res
      .status(500)
      .json({ message: "Error updating preferences", error: err.message });
  }
};
