import createFriendshipModel from "../models/Friendship.js";
import { getConnection } from "../config/dbConnections.js";

export const checkFriendship = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const friendId = req.params.userId; // Get the userId from params

  
    if (userId.toString() === friendId) {
        return next();
    }

    const dbConnection = await getConnection("userDb");
    const Friendship = createFriendshipModel(dbConnection);

    const friendship = await Friendship.isFriendshipExists(userId, friendId);

  
    if (!friendship || friendship.status !== "accepted") {
        return res.status(403).send({ message: "You are not friends with this user" });
    }

      next();
  } catch (error) {
    console.error("Error checking friendship:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};
