import { logger } from "../src/logger/logger.js";
import { Game } from "./game.model.js";
import { Question, Quiz } from "./quiz.model.js";
import { User } from "./user.model.js";

Quiz.hasMany(Question);
Question.belongsTo(Quiz);

User.hasMany(Quiz, { as: "author" });
Quiz.belongsTo(User, { as: "author" });

Game.hasOne(Quiz);
Quiz.belongsTo(Game);
Game.hasOne(User, { as: "quizMaster" });
Game.hasMany(User, { as: "quizzers" });
User.belongsTo(Game);

export { Quiz, Question, User, Game };
