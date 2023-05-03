import { Question, Quiz } from "../../models/quiz.model.js";
import { User } from "../../models/user.model.js";
import { logger } from "../logger/logger.js";

export default function dbAssociations() {
  try {
    Quiz.hasMany(Question);
    Question.belongsTo(Quiz);
  } catch {
    logger.warn("Quiz already associated with questions");
  }
  try {
    User.hasMany(Quiz);
    Quiz.belongsTo(User, { as: "author" });
  } catch {
    logger.warn("User already associated with quizzes");
  }
}
