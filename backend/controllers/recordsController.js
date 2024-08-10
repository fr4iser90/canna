import { getConnection } from "../config/dbConnections.js";
import createOwnPlantModel from "../models/OwnPlant.js";

const getDateString = (date) => {
  return new Date(date).toISOString().split("T")[0]; // Returns only the date part (YYYY-MM-DD)
};

const addRecord = async (req, res, recordType) => {
  try {
    const dbConnection = await getConnection("userstrainDb");
    const Plant = createOwnPlantModel(dbConnection);

    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).send({ message: "Plant not found" });
    }

    req.body.date = getDateString(req.body.date); // Convert the date to only include the date part
    plant[recordType].push(req.body);
    await plant.save();
    res.status(201).send(plant);
  } catch (error) {
    console.error(`Error adding ${recordType} record:`, error);
    res.status(400).send({
      message: `Error adding ${recordType} record`,
      error: error.message,
    });
  }
};

export const addNutrientRecord = (req, res) =>
  addRecord(req, res, "nutrientRecords");
export const addWaterRecord = (req, res) => addRecord(req, res, "waterRecords");
export const addHeightRecord = (req, res) =>
  addRecord(req, res, "heightRecords");
export const addWidthRecord = (req, res) => addRecord(req, res, "widthRecords");
export const addRootDevelopmentRecord = (req, res) =>
  addRecord(req, res, "rootDevelopment");
export const addHarvestWeightRecord = (req, res) =>
  addRecord(req, res, "harvestWeights");
