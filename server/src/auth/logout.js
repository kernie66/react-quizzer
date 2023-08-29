import { isEmpty } from "radash";
import { Token } from "../../models/token.model.js";
import { logger } from "../logger/logger.js";
import { GeneralError, NotFound } from "../utils/errorHandler.js";

export const logout = async (req, res, next) => {
  if (req.user) {
    const user = req.user.username;
    try {
      const tokens = await Token.findAll({ where: { userId: req.user.id } });
      if (!isEmpty(tokens)) {
        tokens.map((token) => token.destroy());
        logger.debug("Tokens destroyed:", tokens.length);
        res.status(200).json({ success: `User ${user} logged out` });
      } else {
        logger.warn("No token found to delete");
      }
    } catch (error) {
      logger.error("Error when destroying token:", error);
      throw new GeneralError("Cannot log out, error deleting user token...");
    }
  } else {
    throw new NotFound("User not logged in...");
  }
  next();
};
