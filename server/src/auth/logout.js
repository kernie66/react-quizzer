import { isEmpty } from "radash";
import { Token } from "../../models/token.model.js";
import { logger } from "../logger/logger.js";
import { NotFound } from "../utils/errorHandler.js";

export const logout = async (req, res, next) => {
  try {
    if (req.user) {
      const user = req.user.username;

      const tokens = await Token.findAll({ where: { userId: req.user.id } });
      if (!isEmpty(tokens)) {
        tokens.map((token) => token.destroy());
        logger.debug("Tokens destroyed:", tokens.length);
        res.status(200).json({ success: `User ${user} logged out` });
      } else {
        logger.warn("No token found to delete");
        throw new NotFound("No token found to destroy...");
      }
    } else {
      throw new NotFound("User not logged in...");
    }
  } catch (error) {
    next(error);
  }
};
