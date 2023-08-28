import { Router } from "express";
import { checkUser, createUser, deleteUser, getUsers, updateUser } from "../controllers/users.js";
import {
  addQuestion,
  createQuiz,
  deleteQuiz,
  getQuizAuthor,
  getQuizzes,
} from "../controllers/quizzes.js";
import {
  createGame,
  startGame,
  endGame,
  getGameMaster,
  getGames,
  getOneGame,
  getQuestions,
  findGame,
  connectGame,
  disconnectGame,
  getPlayers,
} from "../controllers/games.js";

export const apiRouter = Router();
apiRouter.get("/", (req, res) => {
  res.status(200).json({ success: "This is API root!" });
});

apiRouter.get("/login", (req, res) => {
  res.status(200).json({ success: `User ${req.user.username} already logged in...` });
});

apiRouter.post("/users", createUser);
apiRouter.get("/users", getUsers);
apiRouter.get("/users/:id", getUsers);
apiRouter.put("/users", updateUser);
apiRouter.put("/users/:id", updateUser);
apiRouter.delete("/users/:id", deleteUser);

apiRouter.post("/quizzes", createQuiz);
apiRouter.get("/quizzes", getQuizzes);
apiRouter.get("/quizzes/:id", getQuizzes);
apiRouter.get("/quizzes/:id/author", getQuizAuthor);
apiRouter.post("/quizzes/:id/addQuestion", addQuestion);
apiRouter.delete("/quizzes/:id", deleteQuiz);

apiRouter.post("/games", createGame);
apiRouter.get("/games", getGames);
apiRouter.get("/games/:id", getOneGame);
apiRouter.get("/games/:id/gameMaster", getGameMaster);
apiRouter.get("/games/:id/questions", getQuestions);
apiRouter.put("/games/:id/start", startGame);
apiRouter.put("/games/:id/end", endGame);

apiRouter.get("/play", findGame);
apiRouter.get("/play/players", getPlayers);
apiRouter.get("/play/connect", connectGame);
apiRouter.get("/play/disconnect", disconnectGame);
