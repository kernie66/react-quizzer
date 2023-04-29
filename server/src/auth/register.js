import bcrypt from "bcrypt";
import dbCreateUser from "../db/db.createUser.js";
import { logger } from "../logger/logger.js";

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
    if (statusOk) {
      res.status(201).json({ success: username });
    } else {
      res.status(400).json({ error: "Invalid request data" });
    }
  } catch (error) {
    logger.error("Error creating user:", error);
    res.status(500).json(error);
  }
};
