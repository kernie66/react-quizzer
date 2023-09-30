import { Game } from "./game.model.js";
import { Question, Quiz } from "./quiz.model.js";
import { ResetToken, Token } from "./token.model.js";
import { User } from "./user.model.js";

Quiz.hasMany(Question);
Question.belongsTo(Quiz);

User.hasMany(Quiz);
Quiz.belongsTo(User, { as: "author" });

Game.hasOne(Quiz);
Quiz.belongsTo(Game);
Game.hasOne(User, { as: "quizMaster" });
Game.belongsToMany(User, { through: "scoreboard", as: "players" });
User.belongsToMany(Game, { through: "scoreboard" });

User.hasOne(Token);
Token.belongsTo(User);

User.hasOne(ResetToken);
ResetToken.belongsTo(User);
export { Quiz, Question, User, Game, Token, ResetToken };
