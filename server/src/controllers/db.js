import { db } from "../db/db.config.js";
import { logger } from "../logger/logger.js";

export const syncDb = async (req, res) => {
  let option = {};
  if (req.body.options === "update") {
    option = { alter: true };
    logger.info("Database models updated");
  } else if (req.body.options === "recreate") {
    option = { force: true };
    logger.warn("Database has been recreated, old data removed");
  }
  try {
    await db.sync(option);
    logger.info("Successfully synced database");
    res.status(200).json({ success: `Successfully synced database (option: ${req.body.options})` });
  } catch (error) {
    logger.error("Error syncing database:", error);
    res.status(500).json(error);
  }
};
