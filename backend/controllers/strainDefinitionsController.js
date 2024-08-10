import { getConnection } from "../config/dbConnections.js";
import createStrainDefinitionModel from "../models/StrainDefinition.js";

// Fetch all strain definitions
export const getStrainDefinitions = async (req, res) => {
  try {
    const dbConnection = await getConnection("strainDb");
    const StrainDefinition = createStrainDefinitionModel(dbConnection);
    const strains = await StrainDefinition.find();
    res.json(strains);
  } catch (err) {
    console.error("Error fetching strain definitions:", err);
    res.status(500).send({
      message: "Error fetching strain definitions",
      error: err.message,
    });
  }
};

// Create a new strain definition
export const createStrainDefinition = async (req, res) => {
  try {
    const dbConnection = await getConnection("strainDb");
    const StrainDefinition = createStrainDefinitionModel(dbConnection);
    const newStrain = new StrainDefinition(req.body);
    await newStrain.save();
    res.status(201).json(newStrain);
  } catch (err) {
    console.error("Error saving new strain:", err);
    res
      .status(500)
      .send({ message: "Error saving new strain", error: err.message });
  }
};

// Update an existing strain definition
export const updateStrainDefinition = async (req, res) => {
  const { id, ...updateData } = req.body;
  if (!id) {
    return res.status(400).send({ message: "ID is required for updating" });
  }

  try {
    const dbConnection = await getConnection("strainDb");
    const StrainDefinition = createStrainDefinitionModel(dbConnection);
    const updatedStrain = await StrainDefinition.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
    if (!updatedStrain) {
      return res.status(404).send({ message: "Strain definition not found" });
    }
    res.status(200).json(updatedStrain);
  } catch (err) {
    console.error("Error updating strain definition:", err);
    res.status(500).send({
      message: "Error updating strain definition",
      error: err.message,
    });
  }
};

// Delete a strain definition
export const deleteStrainDefinition = async (req, res) => {
  try {
    const dbConnection = await getConnection("strainDb");
    const StrainDefinition = createStrainDefinitionModel(dbConnection);
    const strain = await StrainDefinition.findByIdAndDelete(req.params.id);
    if (!strain) {
      return res.status(404).send({ message: "Strain definition not found" });
    }
    res.status(200).send({ message: "Strain definition deleted" });
  } catch (err) {
    console.error("Error deleting strain definition:", err);
    res.status(500).send({
      message: "Error deleting strain definition",
      error: err.message,
    });
  }
};

// Fetch random strain definitions
export const getRandomStrains = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  try {
    const dbConnection = await getConnection("strainDb");
    const StrainDefinition = createStrainDefinitionModel(dbConnection);
    const strains = await StrainDefinition.aggregate([
      { $sample: { size: limit } },
    ]).exec();
    res.json(strains);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching random strains", error: err.message });
  }
};

export const getStrainDefinitionById = async (req, res) => {
  try {
    const dbConnection = await getConnection("strainDb");
    const StrainDefinition = createStrainDefinitionModel(dbConnection);
    const strain = await StrainDefinition.findById(req.params.id);
    if (!strain) {
      return res.status(404).send({ message: "Strain definition not found" });
    }
    res.json(strain);
  } catch (err) {
    console.error("Error fetching strain definition:", err);
    res.status(500).send({
      message: "Error fetching strain definition",
      error: err.message,
    });
  }
};