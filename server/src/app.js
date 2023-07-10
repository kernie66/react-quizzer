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
import { authRouter } from "./routes/authRouter.js";

const invalidPathHandler = (req, res) => {
  res.status(404).json({ error: "Invalid path" });
};

export const app = express();

logger.debug("Source location:", new URL(import.meta.url).pathname);
const publicPath = setPath("../public");
const buildPath = setPath("../build");
logger.debug("Path to public files:", publicPath);
logger.debug("Path to build files:", buildPath);
app.use(express.static(buildPath));
app.use(express.static(publicPath));
// app.use("/locales", express.static(localesPath));
app.use(cors({ credentials: true, origin: "http://localhost:3002" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const SequelizeStore = storeBuilder(session.Store);
const myStore = new SequelizeStore({
  db,
});

app.use(
  session({
    secret: process.env.SECRET,
    store: myStore,
    resave: true,
    saveUninitialized: false,
    cookie: { expires: 30 * 24 * 60 * 60 * 1000 },
  }),
);
myStore.sync();

app.use(passport.session());
passport.use(new LocalStrategy(authUser));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);
// app.use(printData);

app.use(morgan("dev"));
app.use("/api/auth", authRouter);
app.use("/api/db", dbRouter);
app.use("/api", checkAuthenticated, apiRouter);
app.post("/register", register);
app.get("/login", checkLoggedIn, (req, res) => {
  res.status(200).json({ success: `User ${req.user.username} already logged in...` });
});
app.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json(req.user); // { success: `User ${req.user.username} logged in` });
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
  const dbStatus = testDbConnection();
  let statusString;
  if (dbStatus) {
    statusString = "Connection to database established";
  } else {
    statusString = "Couldn't connect to the database";
  }
  res.send("<h3>Welcome to the Quizzer API server...</h3>" + statusString);
});

app.get("/sync", (req, res) => {
  dbSync(true);
  res.send("Synchronize database...");
});

app.get("/password", (req, res) => {
  res.send(zxcvbn("audi100"));
});

app.use(invalidPathHandler);
