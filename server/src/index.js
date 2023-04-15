#!/usr/bin/env node
import normalizePort from "./utils/normalizePort.js";
import { logger } from "./logger/logger.js";
import { app } from "./app.js";

const apiPort = normalizePort(process.env.PORT || "3000");

app.listen(apiPort, () => logger.info(`Server running on port ${apiPort}`));
