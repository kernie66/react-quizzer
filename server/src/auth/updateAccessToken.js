import { Token } from "../../models/index.js";
import jwt from "jsonwebtoken";
import createAccessToken from "./createAccessToken.js";
import { logger } from "../logger/logger.js";

export default async function updateAccessToken(req, res) {
  const requestToken = req.body.refreshToken;
  logger.debug("Refresh token:", requestToken);
  if (requestToken == null) {
    return res.status(403).send("Refresh Token is required!");
  }

  try {
    let refreshToken = await Token.findOne({ where: { token: requestToken } });
    if (!refreshToken) {
      res.status(403).json({ error: "Invalid refresh token" });
      return;
    }
    try {
      const validToken = jwt.verify(requestToken, process.env.JWT_REFRESH_SECRET);
      logger.info("Valid refresh token for user", validToken.username);

      const newAccessToken = await createAccessToken(validToken.id);
      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: refreshToken.token,
      });
      // if (req.user.username !== validToken.username) {
      //  res.status(401).send("Refresh token is not associated with the logged in user");
      //  return;
      // }
    } catch (error) {
      if (error.name === jwt.TokenExpiredError) {
        Token.destroy({ where: { id: refreshToken.id } });
        res
          .status(403)
          .json({ error: "Refresh token was expired. Please make a new sign in request" });
        return;
      } else {
        res.status(403).json(error);
      }
    }
  } catch (error) {
    logger.error("Error updating access token:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
