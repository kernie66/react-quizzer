import { Game } from "../../models/index.js";

export default async function dbCreateGame(quizId, quizMaster) {
  const newGame = await Game.create({ status: "prepared" });
  await newGame.setQuiz(quizId);
  await newGame.setQuizMaster(quizMaster);
  await newGame.save();
  return true;
}
