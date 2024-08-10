import { updatePlantPhase } from '../utils/phaseUtils.js';
import { getConnection } from '../config/dbConnections.js';
import createOwnPlantModel from '../models/OwnPlant.js';

const phaseMiddleware = async (req, res, next) => {
  const dbConnection = await getConnection("userstrainDb");
  const ownPlant = createOwnPlantModel(dbConnection);

  try {
    let plantId = null;
    if (req.method === 'GET' && req.params.id) {
      plantId = req.params.id;
    } else if ((req.method === 'PUT' || req.method === 'POST') && req.params.id) {
      plantId = req.params.id;
    } else if ((req.method === 'PUT' || req.method === 'POST') && req.body.plantId) {
      plantId = req.body.plantId;
    }

    if (plantId) {
      const plant = await ownPlant.findById(plantId);
      if (!plant) {
        console.log("Plant not found");
      } else {
        await updatePlantPhase(plantId, dbConnection);
      }
    } else {
      console.log("No plantId found in request");
    }
  } catch (error) {
    console.error("Error updating plant phase:", error);
    return res.status(500).send({ message: "Error updating plant phase", error: error.message });
  }

  next();
};

export default phaseMiddleware;
