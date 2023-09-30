import { ResetToken } from "../../models/index.js";
import bcrypt from "bcrypt";
import { logger } from "../logger/logger.js";

export default async function dbCreateResetToken(user, language) {
  let crypto;
  try {
    crypto = await import("node:crypto");
  } catch (err) {
    logger.error("Crypto support is disabled!");
  }

  try {
    const bcryptSalt = 10;

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

    logger.debug("Reset token", resetToken);

    try {
      const [newToken, created] = await ResetToken.findOrCreate({
        where: { userId: user.id },
        defaults: { resetToken: hash, language: language },
      });
      if (created) {
        logger.debug("New reset password token created for user:", user.username);
      } else {
        newToken.update({ resetToken: hash, language: language });
        logger.debug("Reset token updated for user:", user.username);
      }
    } catch (error) {
      logger.error("Failed to create reset token", error);
      Promise.reject(error);
    }
    return resetToken;
  } catch (error) {
    logger.error("Failed to create reset token:", error);
    Promise.reject(error);
  }
}
