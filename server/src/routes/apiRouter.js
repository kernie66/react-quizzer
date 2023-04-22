import { Router } from "express";
import { createUser, deleteUser, getUsers, updateUser } from "../controllers/users.js";
import { createQuiz } from "../controllers/quiz.js";

export const apiRouter = Router();
apiRouter.get("/", (req, res) => res.send("This is API root!"));
apiRouter.post("/users", createUser);
apiRouter.get("/users", getUsers);
apiRouter.put("/users", updateUser);
apiRouter.delete("/users", deleteUser);
apiRouter.post("/quiz", createQuiz);
