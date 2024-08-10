import mongoose from "mongoose";

const { Schema } = mongoose;

const userPreferencesSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  germinationPhase: { type: Number, default: 7 }, // default 7 days
  rootingPhase: { type: Number, default: 10 },
  seedlingPhase: { type: Number, default: 14 }, // default 14 days
  vegetationPhase: { type: Number, default: 28 }, // default 28 days
  bloomPhase: { type: Number, default: 56 }, // default 56 days
  growingEnvironment: {
    type: String,
    enum: ["indoor", "outdoor", "both"],
    default: "indoor",
  },
  preferredSubstrate: {
    type: String,
    enum: ["Soil", "Cocos", "Hydro"],
    default: "Soil",
  },
  fertilizerType: {
    type: String,
    enum: ["mineral", "organic"],
    default: "mineral",
  },
  fertilizerBrand: { type: String, default: "" },
  wateringMethod: {
    type: String,
    enum: ["manual", "automatic"],
    default: "manual",
  },
  wateringFrequency: { type: Number, default: 3 }, // default every 3 days
  lightSource: {
    type: String,
    enum: ["LED", "HPS", "MH", "CFL"],
    default: "LED",
  },
  lightCycle: { type: String, default: "18/6" }, // default 18 hours light, 6 hours dark
  temperatureRange: { type: String, default: "20-25°C" },
  humidityRange: { type: String, default: "40-60%" },
  trainingMethods: { type: [String], default: ["LST"] },
  harvestMethod: { type: String, enum: ["wet", "dry"], default: "dry" },
  dryingEnvironment: { type: String, default: "20°C, 50% RH" },
  curingMethod: { type: String, enum: ["jars", "bags"], default: "jars" },
  useCO2: { type: Boolean, default: false },
  useMycorrhiza: { type: Boolean, default: false },
});

const createUserPreferencesModel = (connection) => {
  if (!connection || typeof connection.model !== "function") {
    console.error("Invalid connection object:", connection);
    throw new Error("Invalid connection object");
  }

  if (connection.models.UserPreferences) {
    return connection.models.UserPreferences;
  }

  return connection.model("UserPreferences", userPreferencesSchema);
};

export default createUserPreferencesModel;
