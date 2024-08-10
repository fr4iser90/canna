import { getConnection } from "../config/dbConnections.js";
import createPlantModel from "../models/OwnPlant.js";

// Create a new plant
export const createPlant = async (req, res) => {
  const {
    strainId,
    origin,
    age,
    status,
    notes,
    heightRecords,
    location,
    substrate,
  } = req.body;
  const dbConnection = await getConnection("userstrainDb");
  const Plant = createPlantModel(dbConnection);

  const newPlant = new Plant({
    strainId,
    userId: req.user._id,
    origin,
    age,
    status,
    notes,
    heightRecords,
    location,
    substrate,
  });

  try {
    await newPlant.save();
    res.status(201).json(newPlant);
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error creating plant", error: err.message });
  }
};

// Set plant to flowering phase
export const setFloweringPhase = async (req, res) => {
  const dbConnection = await getConnection("userstrainDb");
  const Plant = createPlantModel(dbConnection);

  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).send({ message: "Plant not found" });
    }
    if (plant.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: "User not authorized" });
    }
    plant.plantPhase = "bloom phase";
    plant.phaseStartDate = new Date();
    await plant.save();
    res.status(200).json(plant);
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error updating plant phase", error: err.message });
  }
};

// Update plant yield
export const updatePlantYield = async (req, res) => {
  const { yieldInGrams, qualityA, qualityB, qualityC } = req.body;
  const dbConnection = await getConnection("userstrainDb");
  const Plant = createPlantModel(dbConnection);

  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).send({ message: "Plant not found" });
    }
    if (plant.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: "User not authorized" });
    }
    plant.yield = yieldInGrams;
    plant.qualityA = qualityA;
    plant.qualityB = qualityB;
    plant.qualityC = qualityC;
    await plant.save();
    res.status(200).json(plant);
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error updating plant yield", error: err.message });
  }
};

// Update plant phase reminder settings
export const updateReminderSettings = async (req, res) => {
  const { nextReminderDate, reminderDisabled } = req.body;
  const dbConnection = await getConnection("userstrainDb");
  const Plant = createPlantModel(dbConnection);

  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).send({ message: "Plant not found" });
    }
    if (plant.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: "User not authorized" });
    }
    plant.nextReminderDate = nextReminderDate;
    plant.reminderDisabled = reminderDisabled;
    await plant.save();
    res.status(200).json(plant);
  } catch (err) {
    res.status(500).send({
      message: "Error updating reminder settings",
      error: err.message,
    });
  }
};

// Update plant phase durations
export const updatePhaseDurations = async (req, res) => {
  const { id } = req.params;
  const { phaseDurations } = req.body;
  const dbConnection = await getConnection("userstrainDb");
  const Plant = createPlantModel(dbConnection);

  try {
    const plant = await Plant.findById(id);
    if (!plant) {
      return res.status(404).send({ message: "Plant not found" });
    }
    if (plant.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: "User not authorized" });
    }

    plant.phaseDurations = {
      ...plant.phaseDurations,
      ...phaseDurations,
    };

    await plant.save();
    res
      .status(200)
      .send({ message: "Phase durations updated successfully", plant });
  } catch (err) {
    console.error("Error updating phase durations:", err);
    res.status(500).send({ message: "Error updating phase durations" });
  }
};

// Set plant to a specific phase
export const setPlantPhase = async (req, res) => {
  const { id } = req.params;
  const { plantPhase } = req.body;
  const dbConnection = await getConnection("userstrainDb");
  const Plant = createPlantModel(dbConnection);

  try {
    const plant = await Plant.findById(id);
    if (!plant) {
      return res.status(404).send({ message: "Plant not found" });
    }
    if (plant.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: "User not authorized" });
    }

    plant.plantPhase = plantPhase;
    plant.phaseStartDate = new Date();

    await plant.save();
    res
      .status(200)
      .send({ message: "Plant phase updated successfully", plant });
  } catch (err) {
    console.error("Error updating plant phase:", err);
    res.status(500).send({ message: "Error updating plant phase" });
  }
};

// Update plant details (including additional attributes)
export const updatePlant = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const dbConnection = await getConnection("userstrainDb");
  const Plant = createPlantModel(dbConnection);

  try {
    const plant = await Plant.findByIdAndUpdate(id, updateData, { new: true });
    if (!plant) {
      return res.status(404).send({ message: "Plant not found" });
    }

    res.status(200).send({ message: "Plant updated successfully", plant });
  } catch (err) {
    console.error("Error updating plant:", err);
    res.status(500).send({ message: "Error updating plant" });
  }
};
