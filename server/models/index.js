import { Question, Quiz } from "./quiz.model.js";
import { User } from "./user.model.js";

Quiz.hasMany(Question);
Question.belongsTo(Quiz);

User.hasMany(Quiz);
Quiz.belongsTo(User, { as: "author" });

export { Quiz, Question, User };
