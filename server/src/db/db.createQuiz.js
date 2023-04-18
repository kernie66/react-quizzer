import { Quiz } from "../../models/quiz.model.js";
import { logger } from "../logger/logger.js";

export default async function dbCreateQuiz(quizData, currentUser) {
  const existingQuiz = JSON.parse(
    JSON.stringify(
      await Quiz.findAll({
        where: {
          quizTitle: quizData.quizTitle,
        },
      }),
    ),
  );

  logger.info("Logger:", existingQuiz ? existingQuiz : "No data");

  if (existingQuiz.length === 0) {
    const lastUsed = new Date();
    try {
      const newQuiz = await Quiz.create({
        quizTitle: quizData.quizTitle,
        quizSynopsis: quizData.quizSynopsis,
        lastUsed: lastUsed,
        creator: currentUser || null,
      });
      logger.info("Successfully created quiz", quizData.quizTitle);
      return true;
    } catch (error) {
      logger.error("Failed to create quiz:", error);
    }
  } else {
    logger.info("Quiz with same title already exist:", existingQuiz[0].quizTitle);
  }
  return false;
}
