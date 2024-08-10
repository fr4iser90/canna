import cron from 'node-cron';
import { updateAllPlantPhases } from '../utils/phaseUtils.js';
import createUserModel from '../models/User.js';
import { getConnection } from '../config/dbConnections.js';
import createOwnPlantModel from "../models/OwnPlant.js";

const schedulePhaseUpdates = () => {
  cron.schedule('0 0 * * *', async () => {  // Runs every day at midnight
    console.log('Running scheduled job to update plant phases');
    
    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);
    const users = await User.find();

    for (const user of users) {
      await updateAllPlantPhases(user._id);
      // Here you can add notification logic
    }
  });

  cron.schedule("0 0 * * *", extendVegetationPhase);  // Separate schedule for extending vegetation phase
};

const extendVegetationPhase = async () => {
  try {
    const dbConnection = await getConnection("userstrainDb");
    const OwnPlant = createOwnPlantModel(dbConnection);

    // Find all mother plants in the vegetation phase
    const motherPlants = await OwnPlant.find({ isMotherPlant: true, plantPhase: "vegetation" });

    for (const plant of motherPlants) {
      // Extend vegetation phase by one day
      const today = new Date().toISOString().split("T")[0];
      plant.phaseEvents = plant.phaseEvents.map(event => {
        if (event.phase === "vegetation") {
          event.end = today; // Set today's date as the end date
        }
        return event;
      });

      await plant.save();
    }
  } catch (err) {
    console.error("Error extending vegetation phase:", err);
  }
};

export default schedulePhaseUpdates;