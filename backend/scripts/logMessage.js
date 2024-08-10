import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import { getConnection } from '../config/dbConnections.js';
import createUserModel from '../models/User.js';
import createStrainModel from '../models/StrainDefinition.js';
import createUserPlantModel from '../models/Plant.js';

// Get __filename and __dirname equivalents
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, "../../secrets/env/secrets.env"),
});
dotenv.config({
  path: path.resolve(__dirname, "../../secrets/env/weedmongo.env"),
});

// Function to center text within a fixed width
const centerText = (text, width) => {
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  const paddedText = ' '.repeat(padding) + text;
  return paddedText.padEnd(width, ' ');
};

// Function to get the count of documents in a collection
const getDocumentCount = async (connection, modelName) => {
  const model = modelName(connection);
  return await model.countDocuments();
};

export const generateLogMessage = async (PORT) => {
  const width = 60; // Adjust width for consistency

  try {
    // Connect to databases and get document counts
    const userDbConnection = await getConnection("userDb");
    const strainDbConnection = await getConnection("strainDb");
    const userStrainDbConnection = await getConnection("userstrainDb");

    const registeredUsersCount = await getDocumentCount(userDbConnection, createUserModel);
    const strainCount = await getDocumentCount(strainDbConnection, createStrainModel);
    const userPlantCount = await getDocumentCount(userStrainDbConnection, createUserPlantModel);

    const lines = [
      'Server is running on port ' + PORT,
      'Registered users: ' + registeredUsersCount,
      'Plants in database: ' + strainCount,
      'User Plants in database: ' + userPlantCount,
      'Frontend URL: ' + (process.env.URLFRONTEND || 'Not defined'),
      'Backend URL:  ' + (process.env.URLBACKEND || 'Not defined'),
    ];

    // Add a special message if there are no registered users
    if (registeredUsersCount === 0) {
      lines.push('Claim your server: First registered user gets admin role');
    }

    const centeredLines = lines.map(line => centerText(line, width));

    const logMessage = `
||${'='.repeat(width)}||
||${' '.repeat(width)}||
${centeredLines.map(line => `||${line}||`).join('\n')}
||${' '.repeat(width)}||
||${'='.repeat(width)}||
`;

    return logMessage;

  } catch (error) {
    console.error("Error generating log message:", error);
    throw error; // Ensure errors are properly propagated
  }
};
