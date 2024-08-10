import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
});

const createPermissionModel = (connection) => {
  if (!connection || typeof connection.model !== "function") {
    console.error("Invalid connection object:", connection);
    throw new Error("Invalid connection object");
  }

  if (connection.models.Permission) {
    return connection.models.Permission;
  }

  return connection.model("Permission", permissionSchema);
};

export default createPermissionModel;
