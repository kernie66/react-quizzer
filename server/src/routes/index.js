import { Router } from "express";
import { createUser, deleteUser, getUsers, updateUser } from "../controllers/users.js";
import { createQuiz } from "../controllers/quiz.js";

export const router = Router();
router.get("/", (req, res) => res.send("This is root!"));
router.post("/users", createUser);
router.get("/users", getUsers);
router.put("/users", updateUser);
router.delete("/users", deleteUser);
router.post("/quiz", createQuiz);
