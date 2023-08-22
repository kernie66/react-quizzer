import { isEmpty } from "radash";
import { Token } from "../../models/token.model.js";
import { logger } from "../logger/logger.js";

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
      res.status(500).json({ error: "Cannot log out, error deleting user token..." });
    }
  } else {
    res.status(404).json({ error: "User not logged in..." });
  }
  next();
};
