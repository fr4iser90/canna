import mongoose from "mongoose";

const heightRecordSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  height: { type: Number, required: true },
});

const widthRecordSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  width: { type: Number, required: true },
});

const waterRecordSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  waterAmount: { type: Number, required: true },
});

const harvestWeightSchema = new mongoose.Schema({
  quality: { type: String, enum: ["A", "B", "C"], required: true },
  weight: { type: Number, required: true },
});

const nutrientRecordSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  nutrientType: { type: String, required: true },
  amount: { type: Number, required: true },
});

const rootDevelopmentSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  observation: { type: String, required: true },
});

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  description: { type: String },
  phase: {
    type: String,
    enum: ["germination", "seedling", "vegetation", "bloom", "harvest"],
  },
});

const archivedPlantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  genetics: { type: String },
  thc: { type: String },
  cbd: { type: String },
  startDate: { type: Date },
  growthMethod: { type: String, enum: ["seed", "cutting"], default: "seed" },
  flowering_type: { type: String, enum: ["Photoperiod", "Autoflowering"] },
  flowering_time: { type: String },
  isMotherPlant: { type: Boolean, default: false },
  parentPlant: { type: mongoose.Schema.Types.ObjectId, ref: "OwnPlant" },
  childrenPlants: [{ type: mongoose.Schema.Types.ObjectId, ref: "OwnPlant" }],
  growing_environment: { type: String, enum: ["indoor", "outdoor"] },
  harvestyield: { type: String },
  substrate: { type: String, enum: ["Soil", "Cocos", "Hydro"] },
  fertilizer: { type: String, enum: ["mineral", "organic"] },
  seedtype: { type: String, enum: ["automatic", "f1", "regular", "feminized"] },
  heightRecords: [heightRecordSchema],
  widthRecords: [widthRecordSchema],
  waterRecords: [waterRecordSchema],
  nutrientRecords: [nutrientRecordSchema],
  rootDevelopment: [rootDevelopmentSchema],
  plantPhase: {
    type: String,
    enum: [
      "germination",
      "rooting",
      "seedling",
      "vegetation",
      "bloom",
      "harvested",
      "died",
    ],
    default: "germination",
  },
  phaseStartDate: { type: Date, default: Date.now },
  phaseDurations: {
    germination: { type: Number, default: null },
    rooting: { type: Number, default: null },
    seedling: { type: Number, default: null },
    vegetation: { type: Number, default: null },
    bloom: { type: Number, default: null },
  },
  currentPhase: { type: String, default: "germination" },
  crowns: { type: Number },
  harvestWeights: [harvestWeightSchema],
  biggestBudInGram: { type: Number },
  growthConditions: {
    temperature: { type: Number },
    humidity: { type: Number },
    lightIntensity: { type: Number },
    co2Level: { type: Number },
    phLevel: { type: Number },
    airMovement: { type: String },
  },
  diseases: { type: String },
  growthTechniques: { type: String },
  observations: { type: String },
  earlyDeathDescription: { type: String },
  inCalendar: { type: Boolean, default: false },
  images: [imageSchema],
  archivedDate: { type: Date, default: Date.now },
});

const createArchivedPlantModel = (connection) => {
  if (!connection || typeof connection.model !== "function") {
    throw new Error("Invalid connection object");
  }
  if (connection.models.ArchivedPlant) {
    return connection.models.ArchivedPlant;
  }
  return connection.model("ArchivedPlant", archivedPlantSchema);
};

export default createArchivedPlantModel;
