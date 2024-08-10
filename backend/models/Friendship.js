// Friendship model
import mongoose from "mongoose";

const friendshipSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Adding index for faster queries
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Adding index for faster queries
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "blocked"], // Defining allowed values
      default: "pending",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  },
);

// Adding compound index to enforce unique friendships
friendshipSchema.index({ user1: 1, user2: 1 }, { unique: true });

// Static method to check if a friendship exists
friendshipSchema.statics.isFriendshipExists = async function (user1Id, user2Id) {
  const friendship = await this.findOne({
    $or: [
      { user1: user1Id, user2: user2Id },
      { user1: user2Id, user2: user1Id },
    ],
  });

  console.log(`Friendship check between ${user1Id} and ${user2Id}: ${friendship}`);
  return friendship;
};

// Instance method to accept a friendship
friendshipSchema.methods.accept = async function () {
  this.status = "accepted";
  await this.save();
};

// Instance method to decline a friendship
friendshipSchema.methods.decline = async function () {
  this.status = "declined";
  await this.save();
};

// Instance method to block a user
friendshipSchema.methods.block = async function () {
  this.status = "blocked";
  await this.save();
};

const createFriendshipModel = (connection) => {
  if (!connection || typeof connection.model !== "function") {
    console.error("Invalid connection object:", connection); // Debug-Ausgabe
    throw new Error("Invalid connection object");
  }

  // Check if the model is already registered
  if (connection.models.Friendship) {
    return connection.models.Friendship;
  }

  // Create and bind the model to the connection
  return connection.model("Friendship", friendshipSchema);
};

export default createFriendshipModel;
