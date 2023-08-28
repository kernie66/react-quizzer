import bcrypt from "bcrypt";
import { User } from "../../models/index.js";
import { logger } from "../logger/logger.js";
import { isEmpty } from "radash";
import isValidEmail from "../utils/isValidEmail.js";
import dbCreateToken from "../db/db.createToken.js";
import { set } from "radash";
import createAccessToken from "./createAccessToken.js";

export const authUser = async (username, password, done) => {
  try {
    let user;
    if (isValidEmail(username)) {
      logger.debug("Search for email", username);
      user = await User.findOne({ where: { email: username } });
    } else {
      logger.debug("Search for username", username);
      user = await User.findOne({ where: { username: username } });
    }
    if (isEmpty(user)) {
      logger.warn("User not found");
      return done(null, false);
    }
    logger.debug("User info:", user.dataValues);
    // Ensure to get the real hashed password and not the redacted print version
    if (user.dataValues.hashedPassword) {
      const passwordsMatch = await bcrypt.compare(password, user.dataValues.hashedPassword);
      if (passwordsMatch) {
        let authenticatedUser = { id: user.id, username: user.username };
        const accessToken = await createAccessToken(user.id);
        if (accessToken) {
          authenticatedUser = set(authenticatedUser, "accessToken", accessToken);
        }
        const refreshToken = await dbCreateToken(user.id);
        if (refreshToken) {
          authenticatedUser = set(authenticatedUser, "refreshToken", refreshToken);
        }
        return done(null, authenticatedUser);
      } else {
        logger.warn("Incorrect username/password combination");
        return done(null, false);
      }
    } else {
      return done("User has not set a password");
    }
  } catch (error) {
    done(error);
  }
};
