import { authenticateToken } from "./authenticateToken.js";
import roleMiddleware from "./roleMiddleware.js";

const authorize = (requiredRoles) => {
  return [authenticateToken, roleMiddleware(requiredRoles)];
};

export default authorize;
