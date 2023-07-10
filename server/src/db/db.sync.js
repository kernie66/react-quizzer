import { logger } from "../logger/logger.js";
import { db } from "./db.config.js";

export default async function dbSync(updateDb) {
  const option = updateDb ? { alter: true } : {};
  try {
    await db.sync(option);
    logger.debug("Successfully synced database");
    return true;
  } catch (error) {
    logger.error("Error syncing database:", error);
    return false;
  }
}
