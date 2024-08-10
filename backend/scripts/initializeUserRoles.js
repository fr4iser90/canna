import { getConnection } from "../config/dbConnections.js";
import createRoleModel from "../models/Role.js";

export const initializeUserRoles = async () => {
  try {
    const dbConnection = await getConnection("userDb"); // Ensure you're using the correct connection
    const Role = createRoleModel(dbConnection);

    // Define the roles you want to create
    const roles = [
      { name: "admin" },
      { name: "moderator" },
      { name: "user" },
      { name: "restrictedUser" },
    ];

    // Create the roles in the database if they do not exist
    for (const roleData of roles) {
      let role = await Role.findOne({ name: roleData.name });
      if (!role) {
        role = new Role(roleData);
        await role.save();
        console.log(`${roleData.name} role created`);
      } else {
        console.log(`${roleData.name} role already exists`);
      }
    }

  } catch (error) {
    console.error("Error initializing roles:", error);
    throw error;
  }
};
