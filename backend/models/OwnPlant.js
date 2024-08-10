import mongoose from "mongoose";
import {
  formatPlantDatesBeforeSave,
  formatPlantDatesBeforeUpdate,
  formatPlantDatesAfterFind,
  formatPlantDatesAfterUpdate,
} from "../middleware/dateFormatMiddleware.js";

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

const phaseEventSchema = new mongoose.Schema({
  phase: { type: String, required: false },
  start: { type: Date, required: false, default: null },
  end: { type: Date, default: null }
});

const ownPlantSchema = new mongoose.Schema({
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
      "not_set",
      "germination",
      "rooting",
      "seedling",
      "vegetation",
      "bloom",
      "harvest",
      "died",
    ],
    default: "not_set",
  },
  phaseEvents: [phaseEventSchema],
  phaseStartDate: { type: Date },
  phaseDurations: {
    germination: { type: Number, default: null },
    rooting: { type: Number, default: null },
    seedling: { type: Number, default: null },
    vegetation: { type: Number, default: null },
    bloom: { type: Number, default: null },
  },
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
});

ownPlantSchema.pre("save", formatPlantDatesBeforeSave);
ownPlantSchema.pre("findOneAndUpdate", formatPlantDatesBeforeUpdate);
ownPlantSchema.post("find", formatPlantDatesAfterFind);
ownPlantSchema.post("findOne", formatPlantDatesAfterFind);
ownPlantSchema.post("findOneAndUpdate", formatPlantDatesAfterUpdate);

const createOwnPlantModel = (connection) => {
  if (!connection || typeof connection.model !== "function") {
    throw new Error("Invalid connection object");
  }
  if (connection.models.OwnPlant) {
    return connection.models.OwnPlant;
  }
  return connection.model("OwnPlant", ownPlantSchema);
};

export default createOwnPlantModel;
