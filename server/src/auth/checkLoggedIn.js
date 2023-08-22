import { Token } from "../../models/index.js";
import { logger } from "../logger/logger.js";
import isEmpty from "../utils/isEmpty.js";

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
    }
  }
  logger.debug("No user logged in");
  res.status(401).json({ error: "User not logged in..." });
};
