import bcrypt from "bcrypt";
import { User } from "../../models/index.js";
import { logger } from "../logger/logger.js";
import isEmpty from "../utils/isEmpty.js";

export const authUser = async (username, password, done) => {
  try {
    const user = await User.findOne({ where: { username: username } });
    logger.debug("Search for username", username);
    if (isEmpty(user)) {
      logger.warn("User not found");
      return done(null, false);
    }
    logger.debug("User info:", user.dataValues);
    if (user.dataValues.hashedPassword) {
      const passwordsMatch = await bcrypt.compare(password, user.dataValues.hashedPassword);
      if (passwordsMatch) {
        const authenticatedUser = { id: user.dataValues.id, username: user.dataValues.username };
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

export const serializeUser = (user, done) => {
  logger.debug("Serialize:", user);
  done(null, user.id);
};

export const deserializeUser = async (id, done) => {
  try {
    logger.debug("Deserialize:", id);
    const user = await User.findByPk(id);
    if (isEmpty(user)) {
      logger.warn(`Deserialize: User with ID ${id} not found`);
      return done(null, false);
    }
    logger.debug("Found user:", user.dataValues);
    return done(null, user.dataValues);
  } catch (error) {
    logger.warn("Deserialize error, assuming database 'Users' needs to be synced", error);
    done(null, error);
  }
};

export function checkAuthenticated(req, res, next) {
  logger.debug("Authenticated:", req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "User not logged in" });
}

export function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return res.status(400).json({ error: "User already logged in" });
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
