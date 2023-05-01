#!/usr/bin/env node
import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { logger } from "./logger/logger.js";
import { db, testDbConnection } from "./db/db.config.js";
import dbSync from "./db/db.sync.js";
import morgan from "morgan";
import zxcvbn from "zxcvbn";
import { apiRouter } from "./routes/apiRouter.js";
import { register } from "./auth/register.js";
import { login } from "./auth/login.js";
//import "./auth/passportConfig.js";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import storeBuilder from "connect-session-sequelize";
import {
  authUser,
  checkAuthenticated,
  checkLoggedIn,
  deserializeUser,
  printData,
  serializeUser,
} from "./auth/authUser.js";
import { dbRouter } from "./routes/dbRouter.js";
import setPath from "./utils/setPath.js";

const invalidPathHandler = (req, res) => {
  res.status(404).json({ error: "Invalid path" });
};

export const app = express();

app.use(express.static(setPath("../public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

const SequelizeStore = storeBuilder(session.Store);
const myStore = new SequelizeStore({
  db,
});

app.use(
  session({
    secret: process.env.SECRET,
    store: myStore,
    resave: false,
    saveUninitialized: true,
  }),
);
myStore.sync();

app.use(passport.session());
passport.use(new LocalStrategy(authUser));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);
// app.use(printData);
app.use(morgan("dev"));
app.use("/api", checkAuthenticated, apiRouter);
app.use("/db", checkAuthenticated, dbRouter);
app.post("/register", register);
app.get("/login", checkLoggedIn, (req, res) => {
  res.status(200).json({ success: "User already logged in..." });
});
app.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json({ success: `User ${req.user.username} logged in` });
});
app.delete("/logout", (req, res, next) => {
  if (req.user) {
    const user = req.user.username;
    req.logOut((error) => {
      if (error) {
        return next(error);
      }
      res.status(200).json({ success: `User ${user} logged out` });
    });
  } else {
    res.status(404).json({ error: "User not logged in..." });
  }
});

app.get("/", (req, res) => {
  res.send("Initializing database...");
  testDbConnection();
});

app.get("/sync", (req, res) => {
  dbSync(true);
  res.send("Synchronize database...");
});

app.get("/password", (req, res) => {
  res.send(zxcvbn("audi100"));
});

app.use(invalidPathHandler);
