import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { isTokenBlacklisted } from '../utils/blacklist.js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicKeyPath = path.resolve(__dirname, '../../secrets/keys/public.pem');
const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

export async function authenticateToken(req, res, next) {
    let token = null;
    // Check the cookies for authData
    if (req.cookies.authData) {
        try {
            const authData = JSON.parse(decodeURIComponent(req.cookies.authData));
            token = authData.accessToken;
        } catch (err) {
            console.error("Error parsing token from cookies:", err.message);
            return res.status(400).json({ message: "Invalid token format in cookies" });
        }
    }

    // If no token is found, deny access
    if (!token) {
        console.error("No token found in cookies");
        return res.status(401).json({ message: "Access denied: No token provided" });
    }

    // Verify if the token is blacklisted
    if (await isTokenBlacklisted(token)) {
        return res.status(403).json({ message: "Access denied: Token is blacklisted" });
    }

    // Verify the token using the public key
    try {
        const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        req.user = {
            _id: decoded._id,
            username: decoded.username,
            roles: decoded.roles
        };
        next();
    } catch (err) {
        console.error("Error verifying token:", err.message);
        return res.status(403).json({ message: "Invalid token", error: err.message });
    }
}
