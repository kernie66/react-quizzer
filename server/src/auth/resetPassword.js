import { User, ResetToken } from "../../models/index.js";
import bcrypt from "bcrypt";
import { logger } from "../logger/logger.js";
import sendEmail from "../utils/sendEmail.js";
import { BadRequest, NotFound } from "../utils/errorHandler.js";
import dbUpdateUser from "../db/db.updateUser.js";

const resetPassword = async (req, res, next) => {
  const userId = req.body.userId;
  const token = req.body.token;
  const newPassword = req.body.password;
  const hashCost = 10;

  logger.debug("Reset password user ID:", userId);

  try {
    const user = await User.findByPk(userId);
    const passwordResetToken = await ResetToken.findOne({ where: { userId: userId } });
    if (!passwordResetToken) {
      throw new NotFound("No password reset token requested");
    } else {
      const currentTime = new Date();
      const resetTokenTime = passwordResetToken.updatedAt;
      logger.debug("Time now:", currentTime);
      logger.debug("Timestamp:", resetTokenTime);
      const minutesSince = (currentTime - resetTokenTime) / 1000 / 60;
      if (minutesSince > 30) {
        throw new BadRequest("Password reset token expired");
      }
    }
    const isValid = await bcrypt.compare(token, passwordResetToken.resetToken);
    if (!isValid) {
      throw new BadRequest("Invalid password reset token");
    }
    const hashedPassword = await bcrypt.hash(newPassword, hashCost);
    const result = await dbUpdateUser(userId, { hashedPassword });
    if (result) {
      logger.debug(result);
      sendEmail(
        user.email,
        "Password Reset Successfully",
        {
          name: user.name,
        },
        "./template/resetPassword.handlebars",
      );
    } else {
      throw new Error("Failed to update password");
    }
    //await passwordResetToken.deleteOne();
    res.status(201).json(`Password updated for user ${user.name}`);
  } catch (error) {
    next(error);
  }
};

export default resetPassword;
