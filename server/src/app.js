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
import { authUser, checkLoggedIn } from "./auth/authUser.js";
import { dbRouter } from "./routes/dbRouter.js";
const invalidPathHandler = (req, res) => {
  res.status(400);
  res.send("Invalid path");
};

export const app = express();

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
passport.serializeUser((userObj, done) => {
  logger.info("Serialize:", userObj);
  done(null, userObj);
});
passport.deserializeUser((userObj, done) => {
  logger.info("Deserialize:", userObj);
  done(null, userObj);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use("/api", apiRouter);
app.use("/db", dbRouter);
// app.post("/register", register);
app.get("/login", checkLoggedIn, (req, res) => {
  res.send("User already logged in...");
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/password",
    failureRedirect: "/login",
  }),
);
//app.post("/login", login);
app.post("/logout", (req, res, next) => {
  req.logOut((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/login");
    logger.info(`-------> User Logged out`);
  });
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
