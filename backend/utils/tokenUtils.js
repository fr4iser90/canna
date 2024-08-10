import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

function generateTokens(user) {
  const accessToken = jwt.sign(
    { _id: user._id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" },
  );
  const refreshToken = jwt.sign(
    { _id: user._id, username: user.username, role: user.role },
    REFRESH_SECRET,
    { expiresIn: "7d" },
  ); // Longer expiration for refresh token
  return { accessToken, refreshToken };
}

export { generateTokens };
