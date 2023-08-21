import bcrypt from "bcrypt";
import { User } from "../../models/index.js";
import { logger } from "../logger/logger.js";
import isEmpty from "../utils/isEmpty.js";
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
    return done(null, user);
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
  if (!req.isAuthenticated()) {
    return res.status(400).json({ error: "No user logged in" });
  }
  next();
}

let count = 1;

export const printData = (req, res, next) => {
  console.log("\n==============================");
  console.log(`------------>  ${count++}`);

  if (req.headers.Authorization) {
    console.log(`req.headers -------> ${req.headers.Authorization}`);
  }

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
