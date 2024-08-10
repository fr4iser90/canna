import mongoose from "mongoose";

const { Schema } = mongoose;

const heightRecordSchema = new Schema({
  date: { type: Date, required: true },
  height: { type: Number, required: true }, // in centimeters
});

const plantSchema = new Schema({
  strainId: { type: Schema.Types.ObjectId, ref: "Strain", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  origin: { type: String, enum: ["seed", "cutting"], required: true },
  age: { type: Number, required: true },
  motherPlantId: { type: Schema.Types.ObjectId, ref: "MotherPlant" },
  status: {
    type: String,
    enum: ["growing", "harvested", "flowering"],
    required: true,
  },
  notes: { type: String },
  heightRecords: [heightRecordSchema],
  yield: { type: Number }, // in grams
  phase: { type: String, enum: ["growth", "flowering"], default: "growth" },
  phaseChangeDate: { type: Date },
  location: { type: String, enum: ["indoor", "outdoor"], required: true },
  substrate: {
    type: String,
    enum: ["Soil", "Cocos", "Hydroculture"],
    required: true,
  },
});

const createPlantModel = (connection) => {
  if (!connection || typeof connection.model !== "function") {
    throw new Error("Invalid connection object");
  }

  if (connection.models.Plant) {
    return connection.models.Plant;
  }

  return connection.model("Plant", plantSchema);
};

export default createPlantModel;
