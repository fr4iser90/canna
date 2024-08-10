import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

const createUserModel = (connection) => {
  if (!connection || typeof connection.model !== "function") {
    console.error("Invalid connection object:", connection);
    throw new Error("Invalid connection object");
  }

  if (connection.models.User) {
    return connection.models.User;
  }

  return connection.model("User", userSchema);
};

export default createUserModel;
