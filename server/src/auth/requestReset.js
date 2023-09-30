import { User } from "../../models/index.js";
import { NotFound } from "../utils/errorHandler.js";
import sendEmail from "../utils/sendEmail.js";
import { logger } from "../logger/logger.js";
import dbCreateResetToken from "../db/db.createResetToken.js";

const requestPasswordReset = async (req, res, next) => {
  const email = req.body.email;
  const resetURL = req.body.resetURL;
  const language = req.body.language;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new NotFound("User does not exist");

    let resetToken = await dbCreateResetToken(user, language);
    logger.debug("Reset token", resetToken);

    const link = `${resetURL}?token=${resetToken}&id=${user.id}`;
    sendEmail(
      user.email,
      "Password Reset Request",
      { name: user.name, link: link },
      `requestResetPassword_${language}`,
    );
    res.status(201).json({ resetToken: resetToken });
  } catch (error) {
    next(error);
  }
};

export default requestPasswordReset;
