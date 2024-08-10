import mongoose from "mongoose";

const { Schema, model } = mongoose;

const strainDefinitionSchema = new Schema({
  name: { type: String, required: true },
  genetics: { type: String },
  thc: { type: String },
  cbd: { type: String },
  effects: { type: String },
  description: { type: String },
  grow_difficulty: { type: String },
  flowering_type: { type: String },
  flowering_time: { type: String },
  harvest_time: { type: String },
  yield_indoor: { type: String },
  yield_outdoor: { type: String },
  height_indoor: { type: String },
  height_outdoor: { type: String },
});

const createStrainDefinitionModel = (connection) => {
  if (!connection || typeof connection.model !== "function") {
    console.error("Invalid connection object:", connection);
    throw new Error("Invalid connection object");
  }

  if (connection.models.StrainDefinition) {
    return connection.models.StrainDefinition;
  }

  return connection.model("StrainDefinition", strainDefinitionSchema);
};
export default createStrainDefinitionModel;
