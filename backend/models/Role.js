import mongoose from "mongoose";

const { Schema } = mongoose;

const roleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
});

const createRoleModel = (connection) => {
  if (!connection || typeof connection.model !== "function") {
    console.error("Invalid connection object:", connection);
    throw new Error("Invalid connection object");
  }

  if (connection.models.Role) {
    return connection.models.Role;
  }

  return connection.model("Role", roleSchema);
};

export default createRoleModel;
