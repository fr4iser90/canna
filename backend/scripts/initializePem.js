import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the secrets.env file
dotenv.config({ path: path.resolve(__dirname, '../../secrets/env/secrets.env') });

const keysDir = path.resolve(__dirname, '../../secrets/keys');
const privateKeyPath = path.join(keysDir, 'private.pem');
const publicKeyPath = path.join(keysDir, 'public.pem');

// Use the JWT_SECRET from the .env file as the password
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  console.error('JWT_SECRET is not defined in the environment variables. Please set it in your secrets.env file.');
  process.exit(1);
}

// Create the keys directory if it doesn't exist
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir, { recursive: true });
}

// Generate private key if it doesn't exist
const initializePem = async () => {
  if (!fs.existsSync(privateKeyPath)) {
    console.log('Generating private key...');
    execSync(`openssl genpkey -algorithm RSA -out ${privateKeyPath} -aes256 -pass pass:${jwtSecret} -pkeyopt rsa_keygen_bits:2048`);
  }

  // Generate public key if it doesn't exist
  if (!fs.existsSync(publicKeyPath)) {
    console.log('Generating public key...');
    execSync(`openssl rsa -pubout -in ${privateKeyPath} -out ${publicKeyPath} -passin pass:${jwtSecret}`);
  }

  console.log('Keys have been initialized successfully.');
  return Promise.resolve();  // Ensures that the function can be awaited
};

export default initializePem;
