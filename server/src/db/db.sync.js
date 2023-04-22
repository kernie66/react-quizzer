import { Question, Quiz } from "../../models/quiz.model.js";
import { User } from "../../models/user.model.js";
import { logger } from "../logger/logger.js";
import { db } from "./db.config.js";

export default async function dbSync(updateDb) {
  const option = updateDb ? { alter: true } : {};
  db.user = User;
  db.quiz = Quiz;
  db.question = Question;
  try {
    Quiz.hasMany(Question);
    Question.belongsTo(Quiz);
  } catch {
    logger.warn("Quiz already associated with question");
  }
  try {
    User.hasMany(Quiz);
    Quiz.belongsTo(User);
  } catch {
    logger.warn("User already associated with quiz");
  }
  try {
    await db.sync(option);
    logger.debug("Successfully synced database");
  } catch (error) {
    logger.error("Error syncing database:", error);
  }
}
