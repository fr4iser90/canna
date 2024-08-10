import attachDbConnection from "../middleware/dbConnection.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import viewRoutes from "../routes/view.js";
import uploadRoutes from "../routes/upload.js";
import authRoutes from "../routes/auth.js";
import userRoutes from "../routes/users.js";
import friendsRoutes from "../routes/friends.js";
import preferencesRoutes from "../routes/preferences.js";
import eventsRoutes from "../routes/events.js";
import calendarShareRoutes from "../routes/calendarShare.js";
import templatePlantDatabase from "../routes/templatePlantDatabase.js";
import testRoutes from "../routes/test.js";
import ownPlantsRoutes from "../routes/ownPlants.js";
import profileRoutes from "../routes/profile.js";
import adminRoutes from "../routes/admin.js";
import roleRoutes from "../routes/role.js";
import tokenRoutes from "../routes/token.js";

export default (app) => {
  // View and upload routes
  app.use("/", viewRoutes);
  app.use("/", uploadRoutes);

  // User-related routes
  const userDbConnection = attachDbConnection("userDb");
  app.use("/api/auth", userDbConnection, authRoutes);
  app.use("/api/token", userDbConnection, tokenRoutes);
  app.use("/api/users", userDbConnection, userRoutes);
  app.use("/api/friends", userDbConnection, friendsRoutes);
  app.use("/api/preferences", userDbConnection, preferencesRoutes);
  app.use("/api/userRole", userDbConnection, roleRoutes);

  // Calendar-related routes
  const calendarDbConnection = attachDbConnection("calendarDb");
  app.use("/api/events", calendarDbConnection, eventsRoutes);
  app.use("/api/calendarShare", calendarDbConnection, calendarShareRoutes);

  // Strain-related routes
  const strainDbConnection = attachDbConnection("strainDb");
  app.use("/api/templatePlantDatabase", strainDbConnection, templatePlantDatabase);
  app.use("/api/randomPlants", strainDbConnection, testRoutes);

  // Own plants routes
  const userStrainDbConnection = attachDbConnection("userstrainDb");
  app.use("/api/ownPlants", userStrainDbConnection, ownPlantsRoutes);

  // Profile routes
  app.use("/api/profile", profileRoutes);

  // Admin-related routes
  const adminDbConnection = attachDbConnection("adminDb");
  app.use("/api/databases", adminDbConnection, adminRoutes);
  app.use("/api/admin", adminDbConnection, (req, res, next) => { roleMiddleware(adminDbConnection, ["admin"])(req, res, next); }, adminRoutes);
};
