import jwt from "jsonwebtoken";
import { logger } from "../logger/logger.js";
import { User } from "../../models/index.js";

export default async function createAccessToken(userId) {
  let user;
  try {
    user = await User.findByPk(userId, {
      attributes: {
        exclude: ["password"],
      },
    });
  } catch (error) {
    logger.error("User not found for access token:", error);
    Promise.reject("User not found");
  }
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
  };
  try {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESSTOKEN_SECRET, {
      expiresIn: process.env.JWT_ACCESSTOKEN_EXPIRATION,
    });
    return accessToken;
  } catch (error) {
    logger.error("Error creating access token:", error);
    Promise.reject(error);
  }
}
