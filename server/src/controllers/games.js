import { Game, Quiz, User } from "../../models/index.js";
import dbCreateGame from "../db/db.createGame.js";
import { logger } from "../logger/logger.js";
import isEmpty from "../utils/isEmpty.js";

export const getGames = async (req, res) => {
  const games = await Game.findAll();
  logger.info("Number of games found:", isEmpty(games) ? "None" : games.length);
  if (!isEmpty(games)) {
    res.status(200).json(games);
  } else {
    res.status(404).json({ error: "No games found." });
    logger.debug("No games found.");
  }
};

export const getOneGame = async (req, res) => {
  const gameId = req.params.id;
  const game = await Game.findByPk(gameId, {
    include: Quiz,
  });
  if (!isEmpty(game)) {
    res.status(200).json(game);
  } else {
    res.status(404).json({ error: `No game with ID ${gameId} found` });
  }
};

export const getQuestions = async (req, res) => {
  const gameId = req.params.id;
  const game = await Game.findByPk(gameId);
  if (!isEmpty(game)) {
    const quiz = await game.getQuiz();
    if (!isEmpty(quiz)) {
      const questions = await quiz.getQuestions();
      res.status(200).json(questions);
    } else {
      res.status(404).json({ error: `No quiz found for game with ID ${gameId}` });
    }
  } else {
    res.status(404).json({ error: `No game with ID ${gameId} found` });
  }
};

export const getGameMaster = async (req, res) => {
  const gameId = req.params.id;
  const game = await Game.findByPk(gameId);
  if (!isEmpty(game)) {
    const quizMaster = await game.getQuizMaster();
    res.status(200).json(quizMaster);
  } else {
    res.status(404).json({ error: `No game with ID ${gameId} found` });
  }
};

export const createGame = async (req, res) => {
  const quizData = req.body;
  const status = await dbCreateGame(quizData.id, req.user.id);
  if (status) {
    res.status(201).json({ success: `Game created: ${quizData.quizTitle}` });
  } else {
    res.status(400).json({ error: `Game couldn't be created: ${quizData.quizTitle}` });
    logger.info("Wrong game info.", status);
  }
};

export const startGame = async (req, res) => {
  let quizMaster = req.user;
  const gameId = req.params.id;
  if (req.body.quizMaster) {
    const quizMasterCheck = await User.findByPk(req.body.quizMaster);
    if (!isEmpty(quizMasterCheck)) {
      quizMaster = quizMasterCheck;
    }
  }
  logger.info("QuizMaster:", quizMaster.toJSON());

  const game = await Game.findByPk(gameId);
  if (!isEmpty(game)) {
    if (game.status === "prepared" || req.body.restart) {
      await game.setQuizMaster(quizMaster);
      game.status = "started";
      game.quizDate = Date.now();
      await game.save();
      res.status(200).json({ success: `Game with ID ${gameId} started` });
    } else {
      res.status(400).json({ error: `Game with ID ${gameId} is not ready to start` });
    }
  } else {
    res.status(404).json({ error: `No game with ID ${gameId} found` });
  }
};

export const endGame = async (req, res) => {
  const gameId = req.params.id;
  const podiumData = req.body;
  const game = await Game.findByPk(gameId);
  if (!isEmpty(game)) {
    if (game.status === "started") {
      await game.set(podiumData);
      game.status = "completed";
      await game.save();
      res.status(200).json({ success: `Game with ID ${gameId} completed` });
    } else {
      res.status(400).json({ error: `Game with ID ${gameId} is not started` });
    }
  } else {
    res.status(404).json({ error: `No game with ID ${gameId} found` });
  }
};

export const findGame = async (req, res) => {
  const game = await Game.findOne({
    where: { status: "started" },
    include: [Quiz],
  });
  if (!isEmpty(game)) {
    res.status(200).json(game);
  } else {
    res.status(404).json({ error: "No active game found" });
  }
};
/*
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
  const id = parseInt(req.params.id);
  const quiz = await Quiz.findByPk(id);
  if (!isEmpty(quiz)) {
    const done = await quiz.destroy();
    res.status(200).json({ success: `Quiz ${quiz.quizTitle} deleted.` });
  } else {
    res.status(404).json({ error: "No matching quiz found." });
    logger.debug("No quiz found to delete.");
  }
};
*/
