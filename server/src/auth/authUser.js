import bcrypt from "bcrypt";
import { User } from "../../models/user.model.js";
import { logger } from "../logger/logger.js";
import isEmpty from "../utils/isEmpty.js";

export const authUser = async (username, password, done) => {
  try {
    const user = await User.findOne({ where: { username: username } });
    logger.info("Username", username);
    if (isEmpty(user)) {
      logger.info("User not found");
      return done(null, false);
    }
    logger.info("User", user.dataValues);
    if (user.dataValues.hashedPassword) {
      const passwordsMatch = await bcrypt.compare(password, user.dataValues.hashedPassword);
      if (passwordsMatch) {
        const authenticatedUser = { id: user.dataValues.id, username: user.dataValues.username };
        return done(null, authenticatedUser);
      } else {
        logger.info("Incorrect username/password combination");
        return done(null, false);
      }
    } else {
      return done("User has not set a password");
    }
  } catch (error) {
    done(error);
  }
};

export function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

export function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/password");
  }
  next();
}
