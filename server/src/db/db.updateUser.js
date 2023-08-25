import { User } from "../../models/index.js";
import { logger } from "../logger/logger.js";
import isEmpty from "../utils/isEmpty.js";

export default async function dbUpdateUser(id, params) {
  try {
    const user = await User.findByPk(id);
    if (!isEmpty(user)) {
      user.set(params);
      await user.save();
      logger.debug("User updated:", params);
      return true;
    } else {
      return false;
    }
  } catch (err) {
    logger.warn("Error when updating user:", err);
    return false;
  }
}
