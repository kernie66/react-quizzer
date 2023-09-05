import { Token } from "../../models/index.js";
import jwt from "jsonwebtoken";
import createAccessToken from "./createAccessToken.js";
import { logger } from "../logger/logger.js";
import { BadRequest, Forbidden } from "../utils/errorHandler.js";

export default async function updateAccessToken(req, res, next) {
  const requestToken = req.body.refreshToken;
  logger.debug("Refresh token:", requestToken);

  try {
    if (requestToken == null) {
      throw new Forbidden("Refresh Token is required!");
    }
    let refreshToken = await Token.findOne({ where: { token: requestToken } });
    if (!refreshToken) {
      throw new BadRequest("Invalid refresh token");
    }
    try {
      const validToken = jwt.verify(requestToken, process.env.JWT_REFRESH_SECRET);
      logger.info("Valid refresh token for user", validToken.username);

      const newAccessToken = await createAccessToken(validToken.id);
      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: refreshToken.token,
      });
    } catch (error) {
      if (error.name === jwt.TokenExpiredError) {
        Token.destroy({ where: { id: refreshToken.id } });
        throw new Forbidden("Refresh token was expired. Please make a new sign in request");
      } else {
        throw new Forbidden(error);
      }
    }
  } catch (error) {
    logger.error("Error updating access token:", error);
    next(error);
  }
}
