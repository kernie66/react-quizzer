import { isEmpty } from "radash";
import { Token } from "../../models/index.js";
import { logger } from "../logger/logger.js";

export const checkLoggedIn = async (req, res, next) => {
  logger.debug("Logged in user:", req.user);
  if (req.user) {
    try {
      const tokens = await Token.findAll({ where: { userId: req.user.id } });
      if (!isEmpty(tokens)) {
        return next();
      }
    } catch (error) {
      logger.error("Error checking database for token:", error);
      return next(error);
    }
  }
  logger.debug("No user logged in");
  // Note: Do not throw error in middleware...
  res.status(401).json({ message: "User not logged in..." });
};
