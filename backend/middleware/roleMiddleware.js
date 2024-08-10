const roleMiddleware = (requiredRoles) => {
  return async (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({
        message: "Forbidden: User not authenticated or roles not found",
      });
    }

    const hasRole = requiredRoles.some((role) => req.user.roles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }

    next();
  };
};

export default roleMiddleware;
