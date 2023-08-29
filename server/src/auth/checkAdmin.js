import { isEmpty } from "radash";
import { Token, User } from "../../models/index.js";
import { logger } from "../logger/logger.js";
import { GeneralError, Unauthorized } from "../utils/errorHandler.js";

export const checkAdmin = async (req, res, next) => {
  logger.debug("Logged in user:", req.user);
  if (req.user) {
    try {
      const tokens = await Token.findAll({ where: { userId: req.user.id } });
      if (!isEmpty(tokens)) {
        const user = await User.findByPk(req.user.id);
        if (user.admin) {
          return next();
        }
      }
    } catch (error) {
      logger.error("Error checking database for token:", error);
      throw new GeneralError("Database error (token)");
    }
  }
  logger.debug("No admin user logged in");
  throw new Unauthorized("Admin user not logged in...");
};
