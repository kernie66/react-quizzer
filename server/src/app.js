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
import storeBuilder from "connect-session-sequelize";
import { checkAuthenticated, checkLoggedIn, printData } from "./auth/authUser.js";
import { dbRouter } from "./routes/dbRouter.js";
import setPath from "./utils/setPath.js";
import { authRouter } from "./routes/authRouter.js";

const invalidPathHandler = (req, res) => {
  res.status(404).json({ error: "Invalid path" });
};

export const app = express();

logger.debug("Source location:", new URL(import.meta.url).pathname);
const publicPath = setPath("../public/server");
const buildPath = setPath("../build");
logger.debug("Path to public files:", publicPath);
logger.debug("Path to build files:", buildPath);
// app.use(express.static(buildPath));
app.use(express.static(publicPath));
// app.use("/locales", express.static(localesPath));
/*
const allowedOrigins = [
  "http://localhost:3002",
  "http://192.168.0.148:3002",
  "http://192.168.1.133:3002",
];
*/
app.use(
  cors({
    credentials: true,
    origin: true,
    exposedHeaders: ["set-cookie"],
    /*
    origin: (origin, callback) => {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      logger.debug("Origin:", origin);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " + "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    */
  }),
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const SequelizeStore = storeBuilder(session.Store);
const myStore = new SequelizeStore({
  db,
});

app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SECRET,
    store: myStore,
    resave: false,
    saveUninitialized: true,
    proxy: true,
    name: "quizzerCookie",
    cookie: { sameSite: "lax", secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 },
  }),
);
myStore.sync();

// app.use(passport.session());
// passport.use(new LocalStrategy(authUser));
import "./auth/passportConfig.js";
import { publicRouter } from "./routes/publicRoutes.js";

app.use(printData);

app.use(morgan("dev"));
app.use("/api/auth", authRouter);
app.use("/api/db", dbRouter);
app.use("/api", passport.authenticate("jwt", { session: false }), apiRouter);
app.use("/", publicRouter);
// app.post("/register", register);
app.get("/login", checkLoggedIn, (req, res) => {
  res.status(200).json({ success: `User ${req.user.username} already logged in...` });
});
/*
app.post("/login", passport.authenticate("local", { session: false }), (req, res) => {
  res.status(200).json(req.user); // { success: `User ${req.user.username} logged in` });
});
*/
app.delete("/logout", passport.authenticate("jwt", { session: false }), (req, res, next) => {
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

app.get("/sync", (req, res) => {
  dbSync(true);
  res.send("Synchronize database...");
});

app.get("/password", (req, res) => {
  res.send(zxcvbn("audi100"));
});

app.use(invalidPathHandler);

const dbStatus = dbSync(true);

logger.info("App initialisation completed");
