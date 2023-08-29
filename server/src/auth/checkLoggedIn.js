import { isEmpty } from "radash";
import { Token } from "../../models/index.js";
import { logger } from "../logger/logger.js";
import { Unauthorized } from "../utils/errorHandler.js";

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
  throw new Unauthorized("User not logged in...");
};
