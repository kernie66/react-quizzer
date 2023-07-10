import { Router } from "express";
import { register } from "../auth/register.js";
import { checkLoggedIn } from "../auth/authUser.js";
import passport from "passport";
import { logout } from "../auth/logout.js";
import { checkUser } from "../controllers/users.js";
import checkPasswordStrength from "../auth/checkPasswordStrength.js";
import { logger } from "../logger/logger.js";
import updateUser from "../db/db.updateUser.js";

export const authRouter = Router();
authRouter.get("/", (req, res) => {
  res.status(200).json({ success: "This is Auth root!" });
});
authRouter.post("/register", register);
authRouter.get("/login", checkLoggedIn, (req, res) => {
  res.status(200).json({ success: `User ${req.user.username} already logged in...` });
});
authRouter.post("/login", passport.authenticate("local"), (req, res) => {
  logger.info("Logging in:", req.user);
  updateUser(req.user.id, { lastSeen: Date.now() });
  res.status(200).json(req.user); // { success: `User ${req.user.username} logged in` });
});
authRouter.delete("/logout", logout);
authRouter.get("/check", checkUser);
authRouter.post("/password", checkPasswordStrength);
