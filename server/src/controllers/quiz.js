import { col, fn } from "@sequelize/core";
import { User } from "../../models/user.model.js";
import { logger } from "../logger/logger.js";
import isEmpty from "../utils/isEmpty.js";
import dbCreateQuiz from "../db/db.createQuiz.js";

async function parseUser(req) {
  let users;
  // Use findAll for all to ensure that the result is an array
  if (req.query.id) {
    const userId = parseInt(req.query.id);
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

export const getQuizzes = async (req, res) => {
  const users = await parseUser(req);
  logger.info("Number of users found:", isEmpty(users) ? "None" : users.length);
  if (!isEmpty(users)) {
    res.status(200).json(users);
  } else {
    res.status(500).send("No matching users found.");
    logger.debug("No users found.");
  }
};

export const createQuiz = async (req, res) => {
  const quizData = req.body;
  logger.info("Quiz", quizData.quizTitle, req.body);
  const status = await dbCreateQuiz(quizData);
  if (status) {
    res.status(201).send(`Quiz created: ${quizData.quizTitle}`);
  } else {
    res.status(500).send(`Quiz couldn't be created: ${quizData.quizTitle}`);
    logger.debug("Wrong quiz info.");
  }
};

export const updateQuiz = async (req, res) => {
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
    res.status(500).send("No matching user found.");
    logger.debug("No user found.");
  }
};

export const deleteQuiz = async (req, res) => {
  const id = parseInt(req.query.id);
  const user = await User.findByPk(id);
  if (!isEmpty(user)) {
    const done = await user.destroy();
    res.status(200).send(`User ${user.username} deleted.`);
  } else {
    res.status(500).send("No matching user found.");
    logger.debug("No user found to delete.");
  }
};
