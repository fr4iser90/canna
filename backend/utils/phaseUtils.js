import { calculatePhaseDates } from '../services/calculationsService.js';
import createOwnPlantModel from '../models/OwnPlant.js';
import { getConnection } from '../config/dbConnections.js';

export const updatePlantPhase = async (plantId, dbConnection) => {
  const ownPlant = createOwnPlantModel(dbConnection);
  const plant = await ownPlant.findById(plantId);
  console.log(`updatePlantPhase called for plant: ${plant ? plant.name : 'Plant not found'}`);

  if (plant) {
    const phaseEvents = calculatePhaseDates(plant);
    plant.phaseEvents = phaseEvents;  // Assuming you store phase events in plant
    console.log(`Calculated phase events: ${JSON.stringify(phaseEvents)}`);
    await plant.save();
    console.log(`Plant phase events updated and saved for plant: ${plant.name}`);
  } else {
    console.log("Plant not found");
  }
};

export const updateAllPlantPhases = async (userId) => {
  const dbConnection = await getConnection("userstrainDb");
  const ownPlant = createOwnPlantModel(dbConnection);

  const plants = await ownPlant.find({ userId });

  plants.forEach(async (plant) => {
    const phaseEvents = calculatePhaseDates(plant);
    plant.phaseEvents = phaseEvents;
    await plant.save();
  });

  return plants;
};
