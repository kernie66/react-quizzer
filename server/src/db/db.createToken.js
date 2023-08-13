import { isEmpty } from "radash";
import { Token, User } from "../../models/index.js";
import jwt from "jsonwebtoken";
const { sign } = jwt;
import { logger } from "../logger/logger.js";

export default async function dbCreateToken(id) {
  try {
    const user = await User.findByPk(id);
    if (!isEmpty(user)) {
      const refreshToken = sign(
        {
          id: user.id,
          username: user.username,
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRATION },
      );
      logger.debug("Token length:", refreshToken.length);
      try {
        const [newToken, created] = await Token.findOrCreate({
          where: { userId: user.id },
          defaults: { token: refreshToken },
        });
        if (created) {
          logger.debug("New refresh token created for user:", user.username);
        } else {
          newToken.update({ token: refreshToken });
          logger.debug("Refresh token updated for user:", user.username);
        }
      } catch (error) {
        logger.error("Failed to get existing token", error);
        Promise.reject(error);
      }
      return refreshToken;
    } else {
      logger.warn("No user found for token generation");
      Promise.reject("User not found");
    }
  } catch (error) {
    logger.error("Failed to create refresh token:", error);
    Promise.reject(error);
  }
}
