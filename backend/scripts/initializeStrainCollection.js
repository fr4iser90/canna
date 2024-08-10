import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import createStrainDefinitionModel from "../models/StrainDefinition.js";

// Obtain the directory name using import.meta.url
const __dirname = path.dirname(new URL(import.meta.url).pathname);

dotenv.config({
  path: path.resolve(__dirname, "../../secrets/env/weedmongo.env"),
});

// Read strain data from external JSON file using an absolute path
const dataFilePath = path.join(__dirname, "../config/strainData.json");
const strains = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));

// Use the MongoDB URI from the environment variables
const strainDbUri = process.env.MONGODB_URI_STRAINDB;

// TLS options
const caPath = path.resolve(__dirname, "../certs/ca.pem");
const combinedPemPath = path.resolve(
  __dirname,
  "../certs/mongodb-combined.pem",
);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsCAFile: caPath,
  tlsCertificateKeyFile: combinedPemPath,
  tlsAllowInvalidCertificates: true,
};

// Function to connect to the MongoDB database
async function connectToDatabase(uri) {
  try {
    await mongoose.connect(uri, options);
    console.log(`Connected to MongoDB at ${uri}`);
  } catch (err) {
    console.error(`Error connecting to MongoDB at ${uri}:`, err);
    process.exit(1); // Exit the process with an error code
  }
}

// Function to insert strains into the MongoDB database
async function insertStrains() {
  await connectToDatabase(strainDbUri);

  try {
    const StrainDefinition = createStrainDefinitionModel(mongoose.connection);
    for (let strain of strains) {
      // Check if the strain already exists
      const existingStrain = await StrainDefinition.findOne({
        name: strain.name,
      });
      if (existingStrain) {
        console.log(`Strain already exists, skipping: ${strain.name}`);
        continue; // Skip this strain if it already exists
      }

      // Ensure to populate necessary fields with default values if they don't exist
      const newStrain = new StrainDefinition({
        name: strain.name,
        genetics: strain.genetics || "",
        thc: strain.thc || "",
        cbd: strain.cbd || "",
        effects: strain.effects || "",
        description: strain.description || "",
        grow_difficulty: strain.grow_difficulty || "",
        flowering_type: strain.flowering_type || "",
        flowering_time: strain.flowering_time || "",
        harvest_time: strain.harvest_time || "",
        yield_indoor: strain.yield_indoor || "",
        yield_outdoor: strain.yield_outdoor || "",
        height_indoor: strain.height_indoor || "",
        height_outdoor: strain.height_outdoor || "",
      });

      await newStrain.save();
      console.log(`Inserted strain: ${strain.name}`);
    }

    console.log("All strains have been processed.");
  } catch (err) {
    console.error("Error inserting strains:", err);
  } finally {
    mongoose.connection.close();
    console.log("Closed connection to Strain MongoDB");
  }
}

// Run the insertStrains function if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  insertStrains().catch((err) => console.error(err));
}

export { insertStrains };
