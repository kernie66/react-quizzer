import passport from "passport";
import { Strategy as JWTStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../../models/user.model.js";
import bcrypt from "bcrypt";
import isEmpty from "../utils/isEmpty.js";
import { logger } from "../logger/logger.js";

const secret = process.env.SECRET;

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ where: { username: username } });
        logger.info("Username", username);
        logger.info("User", user.dataValues.username);
        if (isEmpty(user.dataValues)) {
          return done("User not found");
        }
        const passwordsMatch = await bcrypt.compare(password, user.dataValues.hashedPassword);
        if (passwordsMatch) {
          return done(null, user.dataValues);
        } else {
          return done("Incorrect username/password combination");
        }
      } catch (error) {
        done(error);
      }
    },
  ),
);

passport.
/*
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: (req) => req.cookies.jwt,
      secretOrKey: secret,
    },
    (jwtPayload, done) => {
      if (Date.now() > jwtPayload.expires) {
        return done("JWT expired");
      }
      return done(null, jwtPayload);
    },
  ),
);
*/