import zxcvbn from "zxcvbn";
import { logger } from "../logger/logger.js";

export default async function checkPasswordStrength(req, res) {
  const password = req.body.password;
  const options = req.body.options;
  logger.debug("Password:", password);
  logger.debug("Options:", options);
  const passwordCheck = zxcvbn(password, options);
  logger.debug(passwordCheck);
  res.status(200).json(passwordCheck);
}
