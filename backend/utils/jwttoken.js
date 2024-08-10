import jwt from "jsonwebtoken";

const secretKey = "";
// Define payload data
const payload = {
  username: "admin",
  password: "sup3rs4f3p4ssw0rd",
  role: "admin",
};

// Generate token
const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

console.log("Generated JWT token:", token);

export default token;
