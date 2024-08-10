const mongoose = require("mongoose");
const attachDbConnection = require("../middleware/dbConnection");

async function dropCollections() {
  try {
    // Mock request and response objects for middleware
    const req = {};
    const res = {
      status: (code) => ({
        send: (message) => console.log(`Response ${code}:`, message),
      }),
    };
    const next = (err) => {
      if (err) {
        console.error("Error in middleware:", err);
        return;
      }
    };

    // Attach database connections using middleware
    await attachDbConnection("userDb")(req, res, next);
    const userDbConnection = req.dbConnection;

    await attachDbConnection("calendarDb")(req, res, next);
    const calendarDbConnection = req.dbConnection;

    await attachDbConnection("strainDb")(req, res, next);
    const strainDbConnection = req.dbConnection;

    // Drop collections
    await userDbConnection.collection("users").drop();
    console.log("Dropped users collection.");

    await calendarDbConnection.collection("calendarevents").drop();
    console.log("Dropped calendarevents collection.");

    await strainDbConnection.collection("strains").drop();
    console.log("Dropped strains collection.");

    console.log("Collections dropped successfully.");
  } catch (err) {
    console.error("Error dropping collections:", err);
  } finally {
    mongoose.disconnect();
  }
}

module.exports = dropCollections;
