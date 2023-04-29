import { col, fn } from "sequelize";
import { User } from "../../models/user.model.js";
import dbCreateUser from "../db/db.createUser.js";
import { logger } from "../logger/logger.js";
import isEmpty from "../utils/isEmpty.js";
import bcrypt from "bcrypt";

/* ==========================================================
This function looks for one or more matching users. The users
can be given in the following ways:
  As a URL id parameter, e.g. /users/1
  As a query id, e.g. /users?id=1
  As a query username, e.g. /users?username=john
  As a query name, e.g. /users?name=John
===========================================================*/
async function parseUser(req) {
  let users;
  // Use findAll for all to ensure that the result is an array
  if (req.params.id || req.query.id) {
    const userId = parseInt(req.params.id ? req.params.id : req.query.id);
    users = await User.findAll({
      where: {
        id: userId,
      },
    });
  } else if (req.query.username) {
    const username = req.query.username;
    users = await User.findAll({
      where: {
        username: username,
      },
    });
  } else if (req.query.name) {
    const name = req.query.name;
    users = await User.findAll({
      where: {
        name: name,
      },
    });
  } else {
    users = await User.findAll();
  }
  return users;
}

export const getUsers = async (req, res) => {
  const users = await parseUser(req);
  logger.info("Number of users found:", isEmpty(users) ? "None" : users.length);
  if (!isEmpty(users)) {
    res.status(200).json(users);
  } else {
    res.status(404).json({ error: "No matching users found." });
    logger.debug("No users found.");
  }
};

export const createUser = async (req, res) => {
  const userData = req.body;
  logger.info("User", userData.name, userData.email, req.body);
  const hashCost = 10;

  try {
    const hashedPassword = await bcrypt.hash(userData.password, hashCost);
    userData.hashedPassword = hashedPassword;

    const status = await dbCreateUser(userData);
    if (status) {
      res.status(201).json({ success: `User created for ${userData.name}` });
    } else {
      res.status(400).json({ error: "Error creating user" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateUser = async (req, res) => {
  const userData = await parseUser(req);
  if (!isEmpty(userData)) {
    try {
      const user = userData[0];
      if (req.body.name) {
        user.name = req.body.name;
      }
      if (req.body.email) {
        user.email = req.body.email;
      }
      const updatedUser = await user.save();
      if (req.body.nickname) {
        if (!user.nicknames || (user.nicknames && !user.nicknames.includes(req.body.nickname))) {
          await user.update({
            nicknames: fn("array_append", col("nicknames"), req.body.nickname),
          });
        } else {
          logger.debug("Nickname already exist:", req.body.nickname);
        }
      }
      logger.info(`User ${user.username} has been updated`);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
      logger.error("Update error:", error);
    }
  } else {
    res.status(404).json({ error: "No matching user found." });
    logger.debug("No user found.");
  }
};

export const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await User.findByPk(id);
  if (!isEmpty(user)) {
    const done = await user.destroy();
    res.status(200).json({ success: `User ${user.username} deleted.` });
  } else {
    res.status(404).json({ error: "No matching user found." });
    logger.debug("No user found to delete.");
  }
};
