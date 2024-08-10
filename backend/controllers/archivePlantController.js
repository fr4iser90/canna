import { getConnection } from "../config/dbConnections.js";
import createOwnPlantModel from "../models/OwnPlant.js";
import createArchivedPlantModel from "../models/ArchivedPlant.js";
import { calculatePlantAge, calculatePlantHeight } from "../services/calculationsService.js";
import { getDateString } from "../utils/dateFormat.js";

export const archivePlant = async (req, res) => {
  try {
    const dbConnection = await getConnection("userstrainDb");
    const OwnPlant = createOwnPlantModel(dbConnection);
    const ArchivedPlant = createArchivedPlantModel(dbConnection);
    const userId = req.user._id;

    // Find the plant to archive
    const plantToArchive = await OwnPlant.findOne({ _id: req.params.id, userId: userId });

    if (!plantToArchive) {
      return res.status(404).send({ message: "Plant not found or not authorized" });
    }

    // Create a new archived plant document
    const archivedPlant = new ArchivedPlant({
      ...plantToArchive.toObject(),
      archivedDate: new Date(), // Add any other fields specific to archiving
    });

    // Save the archived plant
    await archivedPlant.save();

    // Remove the plant from the own plants collection
    await OwnPlant.deleteOne({ _id: req.params.id, userId: userId });

    res.status(200).json({ message: "Plant archived successfully", archivedPlant });
  } catch (err) {
    console.error("Error archiving plant:", err);
    res.status(500).send({ message: "Error archiving plant", error: err.message });
  }
};
