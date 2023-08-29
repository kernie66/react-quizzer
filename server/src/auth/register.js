import bcrypt from "bcrypt";
import dbCreateUser from "../db/db.createUser.js";
import { logger } from "../logger/logger.js";
import { BadRequest, GeneralError } from "../utils/errorHandler.js";

export const register = async (req, res) => {
  const { name, username, password, email } = req.body;

  const userData = {};
  const hashCost = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, hashCost);
    userData.username = username;
    userData.hashedPassword = hashedPassword;
    userData.name = name;
    userData.email = email;
    const statusOk = await dbCreateUser(userData);
    logger.debug("Register status:", statusOk);
    if (statusOk) {
      res.status(201).json({ success: username });
    } else {
      throw new BadRequest("Invalid request data");
    }
  } catch (error) {
    logger.error("Error creating user:", error);
    throw new GeneralError(error);
  }
};
