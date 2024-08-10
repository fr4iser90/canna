import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, "../../secrets/end/weedmongo.env"),
});

// Read strain data from external JSON file using an absolute path
const dataFilePath = path.join(__dirname, "strainData.json");
const strains = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));

// Use the MongoDB URI from the environment variables
const strainDbUri = process.env.MONGODB_URI_STRAINDB;

// TLS options
const caPath = path.resolve(__dirname, "../../secrets/ca.pem");
const combinedPemPath = path.resolve(
  __dirname,
  "../../secrets/mongodb-combined.pem",
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
    const connection = await mongoose.createConnection(uri, options);
    console.log(`Connected to MongoDB at ${uri}`);
    return connection;
  } catch (err) {
    console.error(`Error connecting to MongoDB at ${uri}:`, err);
    process.exit(1); // Exit the process with an error code
  }
}

// Function to insert strains into the MongoDB database
async function insertStrains() {
  const strainDbConnection = await connectToDatabase(strainDbUri);

  try {
    const StrainDefinition = (
      await import("../models/StrainDefinition")
    ).default(strainDbConnection);

    for (let strain of strains) {
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

    console.log("All strains have been inserted.");
  } catch (err) {
    console.error("Error inserting strains:", err);
  } finally {
    strainDbConnection.close();
    console.log("Closed connection to Strain MongoDB");
  }
}

// Run the insertStrains function if this script is executed directly
if (require.main === module) {
  insertStrains().catch((err) => console.error(err));
}

export { insertStrains };
