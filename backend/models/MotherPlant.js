import mongoose from "mongoose";

const motherPlantSchema = new mongoose.Schema({
  plantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plant",
    required: true,
  },
  ageAtCutting: { type: Number, required: true },
  notes: { type: String },
  heightAtCutting: { type: Number }, // in centimeters
});

const createMotherPlantModel = (connection) => {
  if (!connection || typeof connection.model !== "function") {
    throw new Error("Invalid connection object");
  }

  // Check if the model is already registered
  if (connection.models.MotherPlant) {
    return connection.models.MotherPlant;
  }

  return connection.model("MotherPlant", motherPlantSchema);
};

export default createMotherPlantModel;
