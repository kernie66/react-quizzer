import { Router } from "express";
import passport from "passport";
import { register } from "../auth/register.js";
import { testDbConnection } from "../db/db.config.js";
import { logger } from "../logger/logger.js";
import dbUpdateUser from "../db/db.updateUser.js";
import updateAccessToken from "../auth/updateAccessToken.js";

export const publicRouter = Router();

publicRouter.post("/register", register);

publicRouter.post("/login", passport.authenticate("local", { session: false }), (req, res) => {
  logger.info("Logging in:", req.user);

  try {
    dbUpdateUser(req.user.id, { lastSeen: Date.now() });
  } catch (error) {
    logger.error("Error updating user last seen time:", error);
  }
  res.status(200).json(req.user);
});

publicRouter.post("/refresh-token", updateAccessToken);

publicRouter.all("/", (req, res) => {
  const dbStatus = testDbConnection();
  let statusString;
  if (dbStatus) {
    statusString = "Connection to database established";
  } else {
    statusString = "Couldn't connect to the database";
  }
  res.send("<h3>Welcome to the Quizzer API server...</h3>" + statusString);
});

/*
publicRouter.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error(info.message ? info.message : err);

        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, "TOP_SECRET");

        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});
*/
