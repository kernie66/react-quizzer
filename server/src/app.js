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
import { checkUser } from "./controllers/users.js";
import { apiRouter } from "./routes/apiRoutes.js";
import { dbRouter } from "./routes/dbRoutes.js";
import { publicRouter } from "./routes/publicRoutes.js";
import { checkLoggedIn } from "./auth/checkLoggedIn.js";
import { checkAdmin } from "./auth/checkAdmin.js";

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

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

import "./auth/passportConfig.js";

app.use(morgan("dev"));
app.get("/api/check", checkUser);
app.use("/api/db", passport.authenticate("jwt", { session: false }), checkAdmin, dbRouter);
app.use("/api", passport.authenticate("jwt", { session: false }), checkLoggedIn, apiRouter);
app.use("/", publicRouter);

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
