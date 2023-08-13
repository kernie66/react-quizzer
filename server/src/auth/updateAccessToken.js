import { Token } from "../../models/index.js";
import jwt from "jsonwebtoken";
import createAccessToken from "./createAccessToken.js";
const { verify } = jwt;

export default async function updateAccessToken(req, res) {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).send("Refresh Token is required!");
  }

  try {
    let refreshToken = await Token.findOne({ where: { token: requestToken } });
    if (!refreshToken) {
      res.status(403).send("Invalid refresh token");
      return;
    }
    try {
      const validToken = verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      if (req.user.username !== validToken.username) {
        res.status(401).send("Refresh token is not associated with the logged in user");
        return;
      }
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        Token.destroy({ where: { id: refreshToken.id } });
        res.status(403).send("Refresh token was expired. Please make a new sign in request");
        return;
      } else {
        res.status(403).send("Erroneous refresh token", error);
      }
    }

    const newAccessToken = createAccessToken(req.user.id);

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    console.log("err", err);
    return res.status(500).send("Internal server error");
  }
}
