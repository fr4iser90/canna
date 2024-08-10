import { getConnection } from "../config/dbConnections.js";
import createOwnPlantModel from "../models/OwnPlant.js";
import createUserPreferencesModel from "../models/UserPreferences.js";
import path from "path";
import fs from "fs/promises";
import {
  calculatePlantAge,
  calculatePlantHeight,
  calculatePhaseDates,
} from "../services/calculationsService.js";
import { getDateString } from "../utils/dateFormat.js";
import { getOrCreateUserPreferences } from "../services/initialUserPreferenceService.js";


export const getOwnPlants = async (req, res) => {
  try {
    const dbConnection = await getConnection("userstrainDb");
    const ownPlant = createOwnPlantModel(dbConnection);
    const userId = req.user._id;
    console.log(`Fetching plants for user: ${userId}`); // Debugging: Log user ID
    const plants = await ownPlant.find({ userId: userId });

    const enrichedPlants = plants.map((plant) => {
      const phases = calculatePhaseDates(plant);
      console.log(
        `Plant ID: ${plant._id}, Name: ${plant.name}, Phases: ${JSON.stringify(
          phases,
        )}`,
      );
      console.log(
        `Plant ID: ${plant._id}, Name: ${plant.name}, Current Phase: ${plant.currentPhase}`,
      ); // Debugging: Log currentPhase

      return {
        ...plant.toObject(),
        age: calculatePlantAge(plant.startDate),
        height: calculatePlantHeight(plant.heightRecords),
        phases, // Calculate phases here
        currentPhase: plant.currentPhase, // Füge currentPhase hinzu
      };
    });

    res.json(enrichedPlants);
  } catch (err) {
    console.error("Error fetching own plants:", err);
    res
      .status(500)
      .send({ message: "Error fetching own plants", error: err.message });
  }
};

export const getOwnPlantById = async (req, res) => {
  try {
    const dbConnection = await getConnection("userstrainDb");
    const OwnPlant = createOwnPlantModel(dbConnection);
    const plantId = req.params.id;
    const userId = req.user._id;

    // Suche die Pflanze anhand von plantId und userId
    const plant = await OwnPlant.findOne({
      _id: plantId,
      userId: userId,
    }).exec();

    if (!plant) {
      return res.status(404).json({ error: "Plant not found" });
    }

    res.status(200).json(plant);
  } catch (error) {
    console.error("Error fetching plant:", error);
    res.status(500).json({ error: "Failed to fetch plant" });
  }
};

export const getFriendsPlants = async (req, res) => {
  try {
    const dbConnection = await getConnection("userstrainDb");
    const ownPlant = createOwnPlantModel(dbConnection);
    // Assuming you have some logic to find friends' userIds
    const friendsUserIds = await getFriendsUserIds(req.user._id);
    const plants = await ownPlant.find({ userId: { $in: friendsUserIds } });
    res.json(plants);
  } catch (err) {
    console.error("Error fetching friends plants:", err);
    res
      .status(500)
      .send({ message: "Error fetching friends plants", error: err.message });
  }
};

// Create a new own plant
export const createOwnPlant = async (req, res) => {
  try {
    const dbConnection = await getConnection("userstrainDb");
    const ownPlant = createOwnPlantModel(dbConnection);
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).send({ message: "User not found" });
    }

    // Hole die Benutzerpräferenzen
    const userPreferences = await getOrCreateUserPreferences(userId);

    const {
      name,
      genetics,
      thc,
      cbd,
      flowering_type,
      flowering_time,
      growingEnvironment,
      isMotherPlant,
      substrate,
      seedType,
      fertilizerType,
      growthMethod,
    } = req.body;

    let phaseDurations;
    if (growthMethod === "seed") {
      phaseDurations = {
        germination: userPreferences.germinationPhase,
        seedling: userPreferences.seedlingPhase,
        vegetation: userPreferences.vegetationPhase,
        bloom: userPreferences.bloomPhase,
      };
    } else if (growthMethod === "cutting") {
      phaseDurations = {
        rooting: userPreferences.rootingPhase,
        vegetation: userPreferences.vegetationPhase,
        bloom: userPreferences.bloomPhase,
      };
    }

    const newPlant = new ownPlant({
      userId,
      name,
      genetics,
      thc,
      cbd,
      flowering_type,
      flowering_time,
      growingEnvironment,
      isMotherPlant,
      substrate,
      seedType,
      fertilizerType,
      growthMethod,
      phaseDurations,
      plantPhase: "not_set",
    });

    await newPlant.save();

    res.status(201).json(newPlant);
  } catch (err) {
    console.error("Error creating new plant:", err);
    res
      .status(500)
      .send({ message: "Error creating new plant", error: err.message });
  }
};

// Update a plant's details
export const updateOwnPlant = async (req, res) => {
  try {
    const dbConnection = await getConnection("userstrainDb");
    const OwnPlant = createOwnPlantModel(dbConnection);
    const userId = req.user._id;

    console.log(
      "Received update request for plant:",
      req.params.id,
      "with data:",
      req.body,
    );

    const updateData = {};
    const fieldsToUpdate = [
      "name",
      "genetics",
      "thc",
      "cbd",
      "startDate",
      "growthMethod",
      "flowering_type",
      "flowering_time",
      "isMotherPlant",
      "parentPlant",
      "childrenPlants",
      "growing_environment",
      "harvestyield",
      "substrate",
      "fertilizer",
      "seedtype",
      "heightRecords",
      "widthRecords",
      "waterRecords",
      "nutrientRecords",
      "rootDevelopment",
      "plantPhase",
      "crowns",
      "harvestWeights",
      "biggestBudInGram",
      "diseases",
      "growthTechniques",
      "observations",
      "earlyDeathDescription",
      "inCalendar",
      "images",
    ];

    // Update fields with direct values
    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (req.body.phaseDurations) {
      updateData["phaseDurations"] = {};
      ["germination", "rooting", "seedling", "vegetation", "bloom"].forEach(
        (phase) => {
          if (req.body.phaseDurations[phase] !== undefined) {
            updateData["phaseDurations"][phase] = req.body.phaseDurations[phase];
          }
        },
      );
    }

    if (req.body.growthConditions) {
      updateData["growthConditions"] = {};
      [
        "temperature",
        "humidity",
        "lightIntensity",
        "co2Level",
        "phLevel",
        "airMovement",
      ].forEach((condition) => {
        if (req.body.growthConditions[condition] !== undefined) {
          updateData["growthConditions"][condition] = req.body.growthConditions[condition];
        }
      });
    }

    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }

    const updatedPlant = await OwnPlant.findOneAndUpdate(
      { _id: req.params.id, userId: userId },
      { $set: updateData },
      { new: true },
    );

    if (!updatedPlant) {
      return res
        .status(404)
        .send({ message: "Plant not found or not authorized" });
    }

    // Calculate phase events
    const phaseEvents = calculatePhaseDates(updatedPlant);

    // Update plant with phase events
    updatedPlant.phaseEvents = phaseEvents;
    await updatedPlant.save();

    const enrichedPlant = {
      ...updatedPlant.toObject(),
      startDate: getDateString(updatedPlant.startDate),
      age: calculatePlantAge(updatedPlant.startDate),
      height: calculatePlantHeight(updatedPlant.heightRecords),
    };

    console.log("Plant updated successfully:", enrichedPlant);

    res.status(200).json(enrichedPlant);
  } catch (err) {
    console.error("Error updating plant details:", err);
    res
      .status(500)
      .send({ message: "Error updating plant details", error: err.message });
  }
};

// Delete an own plant
export const deleteOwnPlant = async (req, res) => {
  try {
    const dbConnection = await getConnection("userstrainDb");
    const ownPlant = createOwnPlantModel(dbConnection);
    const userId = req.user._id;
    const deletedPlant = await ownPlant.findOneAndDelete({
      _id: req.params.id,
      userId: userId,
    });

    if (!deletedPlant) {
      return res
        .status(404)
        .send({ message: "Plant not found or not authorized" });
    }
    res.status(200).json({ message: "Plant deleted successfully" });
  } catch (err) {
    console.error("Error deleting plant:", err);
    res
      .status(500)
      .send({ message: "Error deleting plant", error: err.message });
  }
};

// Upload an image for a plant
export const uploadPlantImage = async (req, res) => {
  try {
    const dbConnection = await getConnection("userstrainDb");
    const ownPlant = createOwnPlantModel(dbConnection);
    const userId = req.user._id;
    const plantId = req.params.id;
    const imagePath = path.join("/uploads", req.file.filename);

    const updatedPlant = await ownPlant.findOneAndUpdate(
      { _id: plantId, userId: userId },
      {
        $push: {
          images: {
            url: imagePath,
            description: req.body.description,
            phase: req.body.phase,
          },
        },
      },
      { new: true },
    );

    if (!updatedPlant) {
      return res
        .status(404)
        .send({ message: "Plant not found or not authorized" });
    }

    res
      .status(200)
      .json({ message: "Image uploaded successfully", imagePath: imagePath });
  } catch (err) {
    console.error("Error uploading image:", err);
    res
      .status(500)
      .send({ message: "Error uploading image", error: err.message });
  }
};

// Delete an image from a plant
export const deletePlantImage = async (req, res) => {
  try {
    const dbConnection = await getConnection("userstrainDb");
    const ownPlant = createOwnPlantModel(dbConnection);
    const userId = req.user._id;
    const plantId = req.params.id;
    const imageId = req.params.imageId;

    const plant = await ownPlant.findOne({ _id: plantId, userId: userId });

    if (!plant) {
      return res
        .status(404)
        .send({ message: "Plant not found or not authorized" });
    }

    const imagePath = plant.images.find(
      (image) => image._id.toString() === imageId,
    );
    if (!imagePath) {
      return res.status(404).send({ message: "Image not found in plant" });
    }

    // Remove image from plant
    plant.images = plant.images.filter(
      (image) => image._id.toString() !== imageId,
    );
    await plant.save();

    // Remove image from filesystem
    fs.unlink(path.join(__dirname, "..", imagePath.url), (err) => {
      if (err) {
        console.error("Error deleting image from filesystem:", err);
      }
    });

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Error deleting image:", err);
    res
      .status(500)
      .send({ message: "Error deleting image", error: err.message });
  }
};

// Placeholder function for getting friends' user IDs
const getFriendsUserIds = async (userId) => {
  // Implement the logic to fetch friends' user IDs based on the logged-in user
  // This is a placeholder function and should be replaced with actual implementation
  return [];
};

export const createCuttings = async (req, res) => {
  try {
    const dbConnection = await getConnection("userstrainDb");
    const OwnPlant = createOwnPlantModel(dbConnection);
    const userId = req.user._id;
    const { motherPlantId, numberOfCuttings } = req.body;

    // Find the mother plant
    const motherPlant = await OwnPlant.findOne({ _id: motherPlantId, userId: userId });
    if (!motherPlant) {
      return res.status(404).json({ error: "Mother plant not found" });
    }

    // Create cuttings
    const cuttings = [];
    for (let i = 0; i < numberOfCuttings; i++) {
      const cutting = new OwnPlant({
        userId,
        name: `${motherPlant.name} Cutting ${i + 1}`,
        genetics: motherPlant.genetics,
        thc: motherPlant.thc,
        cbd: motherPlant.cbd,
        startDate: new Date(),
        growthMethod: "cutting",
        flowering_type: motherPlant.flowering_type,
        flowering_time: motherPlant.flowering_time,
        growthMethod: "cutting",
        isMotherPlant: false,
        parentPlant: motherPlant._id,
        phaseDurations: motherPlant.phaseDurations,
        plantPhase: "not_set",
        phaseEvents: [],
      });

      await cutting.save();
      cuttings.push(cutting._id);
      
      // Add the cutting to the childrenPlants of the mother plant
      motherPlant.childrenPlants.push(cutting._id);
    }
    motherPlant.isMotherPlant = true;
    await motherPlant.save();

    res.status(201).json({ message: "Cuttings created successfully", cuttings });
  } catch (err) {
    console.error("Error creating cuttings:", err);
    res.status(500).send({ message: "Error creating cuttings", error: err.message });
  }
};