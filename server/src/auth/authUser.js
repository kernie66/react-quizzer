import bcrypt from "bcrypt";
import { User } from "../../models/user.model.js";
import { logger } from "../logger/logger.js";
import isEmpty from "../utils/isEmpty.js";

export const authUser = async (username, password, done) => {
  try {
    const user = await User.findOne({ where: { username: username } });
    logger.info("Search for username", username);
    if (isEmpty(user)) {
      logger.info("User not found");
      return done(null, false);
    }
    logger.info("User info:", user.dataValues);
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

export const serializeUser = (user, done) => {
  logger.info("Serialize:", user);
  done(null, user.id);
};

export const deserializeUser = async (id, done) => {
  logger.info("Deserialize:", id);
  const user = await User.findByPk(id);
  logger.info("Found user:", user.dataValues);
  done(null, user.dataValues);
};

export function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/error");
}

export function checkLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/success");
  }
  next();
}

let count = 1;

export const printData = (req, res, next) => {
  console.log("\n==============================");
  console.log(`------------>  ${count++}`);

  console.log(`req.body.username -------> ${req.body.username}`);
  console.log(`req.body.password -------> ${req.body.password}`);

  console.log(`\n req.session.passport -------> `);
  console.log(req.session.passport);

  console.log(`\n req.user -------> `);
  console.log(req.user);

  console.log("\n Session and Cookie");
  console.log(`req.session.id -------> ${req.session.id}`);
  console.log(`req.session.cookie -------> `);
  console.log(req.session.cookie);

  console.log("===========================================\n");

  next();
};
