import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

blacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const createBlacklistModel = (connection) => {
  return connection.model("Blacklist", blacklistSchema);
};

export default createBlacklistModel;
