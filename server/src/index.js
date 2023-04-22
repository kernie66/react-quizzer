#!/usr/bin/env node
import normalizePort from "./utils/normalizePort.js";
import { logger } from "./logger/logger.js";
import { app } from "./app.js";
import dbSync from "./db/db.sync.js";

const apiPort = normalizePort(process.env.PORT || "3000");

app.listen(apiPort, () => {
  try {
    dbSync(false);
    logger.info("Connected to database");
  } catch (error) {
    logger.error("Connection to database failed:", error);
  }
  logger.info(`Server running on port ${apiPort}`);
});
