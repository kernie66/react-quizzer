#!/usr/bin/env node
import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { logger } from "./logger/logger.js";
import dbSync from "./db/db.sync.js";
import morgan from "morgan";
import zxcvbn from "zxcvbn";
import passport from "passport";
import setPath from "./utils/setPath.js";
import { apiRouter } from "./routes/apiRouter.js";
import { authRouter } from "./routes/authRouter.js";
import { dbRouter } from "./routes/dbRouter.js";
import { publicRouter } from "./routes/publicRoutes.js";
import { logout } from "./auth/logout.js";
import { checkLoggedIn } from "./auth/checkLoggedIn.js";

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

app.use(
  cors({
    credentials: true,
    origin: true,
    exposedHeaders: ["set-cookie"],
  }),
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

import "./auth/passportConfig.js";

app.use(morgan("dev"));
app.use("/api/auth", authRouter);
app.use("/api/db", dbRouter);
app.use("/api", passport.authenticate("jwt", { session: false }), checkLoggedIn, apiRouter);
app.use("/", publicRouter);
app.get("/login", checkLoggedIn, (req, res) => {
  res.status(200).json({ success: `User ${req.user.username} already logged in...` });
});

app.delete("/logout", passport.authenticate("jwt", { session: false }), logout);

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
