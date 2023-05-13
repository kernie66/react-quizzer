import { Router } from "express";
import { createUser, deleteUser, getUsers, updateUser } from "../controllers/users.js";
import { addQuestion, createQuiz, deleteQuiz, getQuizzes } from "../controllers/quizzes.js";

export const apiRouter = Router();
apiRouter.get("/", (req, res) => {
  res.status(200).json({ success: "This is API root!" });
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
apiRouter.post("/quizzes/:id/addQuestion", addQuestion);
apiRouter.delete("/quizzes/:id", deleteQuiz);
