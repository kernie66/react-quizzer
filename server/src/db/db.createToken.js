import { isEmpty } from "radash";
import { User } from "../../models/user.model.js";
import jwt from "jsonwebtoken";
const { sign } = jwt;
import { Token } from "../../models/token.model.js";
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
        const existingToken = await Token.findOne({ where: { userId: id } });
        if (isEmpty(existingToken)) {
          const newToken = await Token.create({
            token: refreshToken,
          });
          await newToken.setUser(user);
          await newToken.save();
        } else {
          existingToken.update({ token: refreshToken });
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
