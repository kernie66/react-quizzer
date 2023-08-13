import { verify } from "jsonwebtoken";

export default function verifyToken(req, res, next) {
  const bearer = req.headers.Authorization;
  const token = bearer.split(" ")[1];
  const secret = process.env.JWT_AUTH_SECRET;

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
}
