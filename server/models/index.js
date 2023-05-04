import { logger } from "../src/logger/logger.js";
import { Question, Quiz } from "./quiz.model.js";
import { User } from "./user.model.js";

Quiz.hasMany(Question);
Question.belongsTo(Quiz);

User.hasMany(Quiz, { as: "author" });
Quiz.belongsTo(User, { as: "author" });

export { Quiz, Question, User };
