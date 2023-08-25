import { Sequelize } from "sequelize";
import { logger } from "../logger/logger.js";
import normalizePort from "../utils/normalizePort.js";

const hostName = process.env.DB_HOSTNAME || "localhost";
const hostPort = normalizePort(process.env.DB_PORT || 5432);
const userName = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD || "";
const dialect = "postgres";
let logLevel = process.env.SEQUELIZE_LOG_LEVEL || "info";
let database = process.env.DATABASE;

if (process.env.NODE_ENV === "development") {
  database = database + "_dev";
}
if (process.env.NODE_ENV === "test") {
  database = database + "_test";
  logLevel = "warn";
}
logger.debug(`Using database ${database} at ${hostName}:${hostPort}`);

export const db = new Sequelize(database, userName, password, {
  host: hostName,
  port: hostPort,
  dialect: dialect,
  pool: {
    max: 10,
    min: 0,
    acquire: 20000,
    idle: 5000,
  },
  logging: (msg) => {
    process.env.NODE_ENV === "test"
      ? null
      : logLevel === "info"
      ? null
      : logger.log(logLevel, msg, { service: "Postgres" });
  },
});

export const testDbConnection = async () => {
  try {
    await db.authenticate();
    logger.debug("Database connection has been established successfully.");
    return true;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    return false;
  }
};
