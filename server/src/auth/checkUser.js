import { getUsers } from "../controllers/users.js";
import { logger } from "../logger/logger.js";
import isEmpty from "../utils/isEmpty.js";

export const checkUser = async (req, res) => {
  const users = await getUsers(req, res);
  logger.debug("Check user:", users);
  if (isEmpty(users)) {
    res.status(404).json({ error: "No matching user found" });
  } else {
    res.status(200).json({ success: "User exists" });
  }
};
