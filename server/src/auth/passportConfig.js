import passport from "passport";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { authUser } from "./authUser.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    authUser,
  ),
);

passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_ACCESSTOKEN_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (jwtPayload, done) => {
      console.log("JWT payload:", jwtPayload);
      try {
        return done(null, jwtPayload);
      } catch (error) {
        done(error);
      }
    },
  ),
);
