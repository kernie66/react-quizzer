import { col, fn } from "sequelize";
import { Token, User } from "../../models/index.js";
import dbCreateUser from "../db/db.createUser.js";
import { logger } from "../logger/logger.js";
import bcrypt from "bcrypt";
import { isEmpty, pick } from "radash";
import { GeneralError, NotFound } from "../utils/errorHandler.js";

/* ==========================================================
This function looks for one or more matching users. The users
can be given in the following ways:
  As a URL id parameter, e.g. /users/1
  As a query id, e.g. /users?id=1
  As a query username, e.g. /users?username=john
  As a query name, e.g. /users?name=John
  As a query email, e.g. /users?email=john@doe.com
===========================================================*/
async function parseUser(req) {
  let users;

  try {
    // Use findAll for all to ensure that the result is an array
    if (req.params.id || req.query.id) {
      const userId = parseInt(req.params.id ? req.params.id : req.query.id);
      if (isNaN(userId)) {
        users = null;
      } else {
        users = await User.findAll({
          where: {
            id: userId,
          },
          attributes: {
            exclude: ["hashedPassword"],
          },
        });
      }
    } else if (req.query.username) {
      const username = req.query.username;
      users = await User.findAll({
        where: {
          username: username,
        },
        attributes: {
          exclude: ["hashedPassword"],
        },
      });
    } else if (req.query.name) {
      const name = req.query.name;
      users = await User.findAll({
        where: {
          name: name,
        },
        attributes: {
          exclude: ["hashedPassword"],
        },
      });
    } else if (req.query.email) {
      const email = req.query.email;
      users = await User.findAll({
        where: {
          email: email,
        },
        attributes: {
          exclude: ["hashedPassword"],
        },
      });
    } else if (!isEmpty(req.query)) {
      logger.warn("Unknown query:", req.query);
    } else {
      users = await User.findAll({
        attributes: {
          exclude: ["hashedPassword"],
        },
      });
    }
    return users;
  } catch (error) {
    logger.error("Database query failed:", error);
    Promise.reject(new Error("Query failed"));
  }
}

export const getUsers = async (req, res, next) => {
  try {
    const users = await parseUser(req);
    logger.debug("Number of users found:", isEmpty(users) ? "None" : users.length);
    if (!isEmpty(users)) {
      res.status(200).json(users);
    } else {
      logger.warn("No users found.");
      throw new NotFound("No matching users found.");
    }
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const userData = req.body;
    logger.debug("User", userData.name, userData.email, req.body);
    const hashCost = 10;

    const hashedPassword = await bcrypt.hash(userData.password, hashCost);
    userData.hashedPassword = hashedPassword;

    const status = await dbCreateUser(userData);
    if (status) {
      res.status(201).json({ success: `User created for ${userData.name}` });
    } else {
      throw new GeneralError("Error creating user");
    }
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const userData = await parseUser(req);
    if (!isEmpty(userData)) {
      const user = userData[0];
      const updateUser = pick(req.body, ["name", "email", "aboutMe", "avatarType"]);
      logger.debug("Update user with:", updateUser);
      const updatedUser = await user.update(updateUser);
      if (req.body.nickname) {
        if (!user.nicknames || (user.nicknames && !user.nicknames.includes(req.body.nickname))) {
          await user.update({
            nicknames: fn("array_append", col("nicknames"), req.body.nickname),
          });
        } else {
          logger.warn("Nickname already exist:", req.body.nickname);
        }
      }
      logger.debug(`User ${user.username} has been updated`);
      res.status(200).json(updatedUser);
    } else {
      logger.warn("No user found.");
      throw new NotFound("No matching user found.");
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    try {
      const tokens = await Token.findAll({ where: { userId: id } });
      if (!isEmpty(tokens)) {
        tokens.map((token) => token.destroy());
        logger.debug("Tokens destroyed:", tokens.length);
      } else {
        logger.warn("No token found to delete");
      }
    } catch (error) {
      logger.error("Error when destroying token:", error);
    }
    if (req.user.id === id) {
      logger.warn("This is the current logged in used, will be logged out");
    }
    const user = await User.findByPk(id);
    if (!isEmpty(user)) {
      await user.destroy();
      res.status(200).json({ success: `User ${user.username} deleted.` });
    } else {
      logger.warn("No user found to delete.");
      throw new NotFound("No matching user found.");
    }
  } catch (error) {
    next(error);
  }
};

export const checkUser = async (req, res, next) => {
  try {
    const users = await parseUser(req);
    logger.debug("Number of users found:", isEmpty(users) ? "None" : users.length);
    if (!isEmpty(users)) {
      res.status(200).json({ success: "User exists" });
    } else {
      throw new NotFound("No matching user found.");
    }
  } catch (error) {
    next(error);
  }
};
