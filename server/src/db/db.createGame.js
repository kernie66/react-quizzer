import { Game } from "../../models/game.model.js";

export default async function dbCreateGame(quizId, quizMaster) {
  const newGame = await Game.create();
  console.log(await newGame.setQuiz(quizId));
  console.log(await newGame.setQuizMaster(quizMaster));
  await newGame.save();
  return true;
}
