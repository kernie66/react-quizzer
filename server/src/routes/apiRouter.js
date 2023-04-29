import { Router } from "express";
import { createUser, deleteUser, getUsers, updateUser } from "../controllers/users.js";
import { createQuiz } from "../controllers/quiz.js";

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
apiRouter.post("/quiz", createQuiz);
