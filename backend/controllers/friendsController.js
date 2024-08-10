import { ObjectId } from "mongodb";
import createFriendshipModel from "../models/Friendship.js";
import createUserModel from "../models/User.js";
import { getConnection } from "../config/dbConnections.js";

// Search for friends
export const searchFriends = async (req, res) => {
  try {
    const { query } = req.body;
    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching for friends:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Invite friend
export const inviteFriend = async (req, res) => {
  const { friendId } = req.body;
  if (!friendId) {
    return res.status(400).json({ message: "Friend ID is required" });
  }

  try {
    const dbConnection = await getConnection("userDb");
    const Friendship = createFriendshipModel(dbConnection);

    const existingFriendship = await Friendship.isFriendshipExists(req.user._id, friendId);
    if (existingFriendship) {
      return res.status(400).json({ message: "Friendship already exists" });
    }

    const friendRequest = await Friendship.create({
      user1: req.user._id,
      user2: friendId,
      status: 'pending'
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error inviting friend:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get friend requests
export const getFriendRequests = async (req, res) => {
  try {
    const dbConnection = await getConnection("userDb");
    const Friendship = createFriendshipModel(dbConnection);

    const requests = await Friendship.find({
      user2: req.user._id,
      status: 'pending'
    }).populate('user1').exec();
    
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error getting friend requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Handle friend request (accept/reject)
export const handleFriendRequest = async (req, res) => {
  console.log(`Handling friend request for action: ${req.params.action}, requestId: ${req.body.requestId}`);

  const { requestId } = req.body;
  const { action } = req.params;

  if (!requestId || !['accept', 'reject'].includes(action)) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    const dbConnection = await getConnection("userDb");
    const Friendship = createFriendshipModel(dbConnection);

    const request = await Friendship.findOne({
      _id: new ObjectId(requestId),  // Korrektur hier
      user2: req.user._id
    });

    if (!request) {
      console.log("Request not found");
      return res.status(404).json({ message: "Request not found" });
    }

    if (action === 'accept') {
      await request.accept();
    } else if (action === 'reject') {
      await request.decline();
    }

    console.log(`Request ${action}ed successfully`);
    res.status(200).json({ message: `Request ${action}ed successfully` });
  } catch (error) {
    console.error(`Error handling friend request:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get friends list
export const getFriends = async (req, res) => {
  try {
    const dbConnection = await getConnection("userDb");
    const Friendship = createFriendshipModel(dbConnection);

    const friendships = await Friendship.find({
      $or: [
        { user1: req.user._id, status: 'accepted' },
        { user2: req.user._id, status: 'accepted' }
      ]
    }).populate('user1 user2').exec();

    const uniqueFriends = new Set();

    const friends = friendships.map(f => {
      const friend = f.user1._id.equals(req.user._id) ? f.user2 : f.user1;
      if (!uniqueFriends.has(friend._id.toString())) {
        uniqueFriends.add(friend._id.toString());
        return { _id: friend._id, username: friend.username, email: friend.email };
      }
    }).filter(Boolean);

    res.status(200).json(friends);
  } catch (error) {
    console.error("Error getting friends list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete friend
export const deleteFriend = async (req, res) => {
  const { friendId } = req.params;

  if (!friendId) {
    return res.status(400).json({ message: "Friend ID is required" });
  }

  try {
    const dbConnection = await getConnection("userDb");
    const Friendship = createFriendshipModel(dbConnection);

    await Friendship.updateMany(
      {
        $or: [
          { user1: req.user._id, user2: friendId },
          { user1: friendId, user2: req.user._id }
        ]
      },
      { status: 'deleted' }
    );

    res.status(200).json({ message: "Friend deleted successfully" });
  } catch (error) {
    console.error("Error deleting friend:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Block friend
export const blockFriend = async (req, res) => {
  const { friendId } = req.body;

  if (!friendId) {
    return res.status(400).json({ message: "Friend ID is required" });
  }

  try {
    const dbConnection = await getConnection("userDb");
    const Friendship = createFriendshipModel(dbConnection);

    const friendship = await Friendship.findOneAndUpdate(
      {
        $or: [
          { user1: req.user._id, user2: friendId },
          { user1: friendId, user2: req.user._id }
        ]
      },
      { status: 'blocked' },
      { new: true, upsert: true }
    );

    res.status(200).json(friendship);
  } catch (error) {
    console.error("Error blocking friend:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get blocked users
export const getBlockedUsers = async (req, res) => {
  try {
    const dbConnection = await getConnection("userDb");
    const Friendship = createFriendshipModel(dbConnection);

    const blocked = await Friendship.find({
      $or: [
        { user1: req.user._id, status: 'blocked' },
        { user2: req.user._id, status: 'blocked' }
      ]
    }).populate('user1 user2').exec();

    const blockedUsers = blocked.map(f => {
      const user = f.user1._id.equals(req.user._id) ? f.user2 : f.user1;
      return { _id: user._id, username: user.username, email: user.email };
    });

    res.status(200).json(blockedUsers);
  } catch (error) {
    console.error("Error getting blocked users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Unblock user
export const unblockUser = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const dbConnection = await getConnection("userDb");
    const Friendship = createFriendshipModel(dbConnection);

    await Friendship.updateMany(
      {
        $or: [
          { user1: req.user._id, user2: userId, status: 'blocked' },
          { user1: userId, user2: req.user._id, status: 'blocked' }
        ]
      },
      { status: 'accepted' }
    );

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    console.error("Error unblocking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
