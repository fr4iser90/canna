import { getConnection } from "../config/dbConnections.js";
import createUserPreferencesModel from "../models/UserPreferences.js";

export const getOrCreateUserPreferences = async (userId) => {
  try {
    const dbConnection = await getConnection("userstrainDb");
    const UserPreferences = createUserPreferencesModel(dbConnection);

    let userPreferences = await UserPreferences.findOne({ userId });

    if (!userPreferences) {
      userPreferences = new UserPreferences({
        userId,
        germinationPhase: 7,
        rootingPhase: 10,
        seedlingPhase: 14,
        vegetationPhase: 28,
        bloomPhase: 56,
        growingEnvironment: "indoor",
        preferredSubstrate: "Soil",
        fertilizerType: "mineral",
        fertilizerBrand: "",
        wateringMethod: "manual",
        wateringFrequency: 3,
        lightSource: "LED",
        lightCycle: "18/6",
        temperatureRange: "20-25°C",
        humidityRange: "40-60%",
        trainingMethods: ["LST"],
        harvestMethod: "dry",
        dryingEnvironment: "20°C, 50% RH",
        curingMethod: "jars",
        useCO2: false,
        useMycorrhiza: false,
      });
      await userPreferences.save();
    }

    return userPreferences;
  } catch (error) {
    console.error("Error getting or creating user preferences:", error);
    throw new Error("Error getting or creating user preferences");
  }
};
