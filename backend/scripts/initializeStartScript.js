import { insertStrains } from "./initializeStrainCollection.js";
import { getConnection } from "../config/dbConnections.js";
import createUserModel from "../models/User.js";
import createRoleModel from "../models/Role.js";
import { initializeDatabaseUsers } from './initializeDatabaseUsers.js';
import ensureUsers from "./initializeTestUsers.js";
import ensureInitialUser from "./initializeInitialUser.js";
import ensureFriendship from "./initializeFriendship.js";
import schedulePhaseUpdates from '../services/phaseUpdates.js';
import { generateLogMessage } from './logMessage.js';
import { initializeUserRoles } from './initializeUserRoles.js';

const initializeAndStartServer = async (app, PORT) => {
  try {
    // Initialize database users
    await initializeDatabaseUsers(); // Call to initialize users in MongoDB
    console.log("Database users initialized.");

    // Initialize userDb
    const userDbConnection = await getConnection("userDb");
    createUserModel(userDbConnection);
    createRoleModel(userDbConnection);

    // Initialize roles
    await initializeUserRoles();
    console.log("User roles initialized.");
    
    await insertStrains();
    console.log("Strains initialized.");
    schedulePhaseUpdates();

    // Generate and log the final message
    const logMessage = await generateLogMessage(PORT);
    console.log(logMessage);

    app.listen(PORT, () => {
    });
  } catch (err) {
    console.error("Initialization failed:", err);
    process.exit(1); // Exit the application if any initialization fails
  }
};

export default initializeAndStartServer;
