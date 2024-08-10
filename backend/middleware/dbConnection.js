import { getConnection } from "../config/dbConnections.js";

const attachDbConnection = (dbKey) => async (req, res, next) => {
  try {
    const dbConnection = await getConnection(dbKey);
    if (!dbConnection) {
      console.error(`Database connection for ${dbKey} not found`);
      return res.status(500).send({ message: "Database connection not found" });
    }
    req.dbConnection = dbConnection;
    next();
  } catch (err) {
    console.error("Error initializing database connection:", err);
    return res
      .status(500)
      .send({ message: "Error initializing database connection" });
  }
};

export default attachDbConnection;
