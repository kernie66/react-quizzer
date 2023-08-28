import { isEmpty } from "radash";
import { Token, User } from "../../models/index.js";
import { logger } from "../logger/logger.js";

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
      return res.status(500).json({ error: "Database error" });
    }
  }
  logger.debug("No admin user logged in");
  return res.status(401).json({ error: "Admin user not logged in..." });
};
