import { col, fn } from "sequelize";
import { User } from "../../models/index.js";
import { Quiz } from "../../models/index.js";
import { logger } from "../logger/logger.js";
import isEmpty from "../utils/isEmpty.js";
import dbCreateQuiz from "../db/db.createQuiz.js";

async function parseQuiz(req) {
  let quizzes;
  // Use findAll for all to ensure that the result is an array
  if (req.params.id || req.query.id) {
    const quizId = parseInt(req.params.id ? req.params.id : req.query.id);
    quizzes = await Quiz.findAll({
      where: {
        id: quizId,
      },
    });
  } else if (req.query.title) {
    const quizTitle = req.query.title;
    quizzes = await Quiz.findAll({
      where: {
        quizTitle: quizTitle,
      },
    });
  } else {
    quizzes = await Quiz.findAll();
  }
  return quizzes;
}

export const getQuizzes = async (req, res) => {
  const quizzes = await parseQuiz(req);
  logger.info("Number of quizzes found:", isEmpty(quizzes) ? "None" : quizzes.length);
  if (!isEmpty(quizzes)) {
    res.status(200).json(quizzes);
  } else {
    res.status(404).json({ error: "No quizzes found." });
    logger.debug("No quizzes found.");
  }
};

export const createQuiz = async (req, res) => {
  const quizData = req.body;
  logger.info("Quiz:", quizData.quizTitle);
  const status = await dbCreateQuiz(quizData, req.user.id);
  if (status) {
    res.status(201).json({ success: `Quiz created: ${quizData.quizTitle}` });
  } else {
    res.status(400).json({ error: `Quiz couldn't be created: ${quizData.quizTitle}` });
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
    res.status(404).json({ error: "No matching user found." });
    logger.debug("No user found.");
  }
};

export const deleteQuiz = async (req, res) => {
  const id = parseInt(req.query.id);
  const user = await User.findByPk(id);
  if (!isEmpty(user)) {
    const done = await user.destroy();
    res.status(200).json({ success: `User ${user.username} deleted.` });
  } else {
    res.status(404).json({ error: "No matching user found." });
    logger.debug("No user found to delete.");
  }
};

export const addQuestion = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!isEmpty(quiz)) {
      const exitingQuestion = await quiz.getQuestions({
        where: { questionNumber: req.body.questionNumber },
      });
      if (isEmpty(exitingQuestion)) {
        logger.info("Question:", req.body);
        const done = await quiz.createQuestion(req.body);
        logger.info("Created:", done.toJSON());
        res.status(201).json(req.body);
      } else {
        res.status(400).json({ error: "Question already exist, did you mean to update it?" });
      }
    } else {
      res.status(404).json({ error: "Quiz not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
    logger.warn("Error adding question", error);
  }
};
