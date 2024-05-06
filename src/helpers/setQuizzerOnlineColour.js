export default function setQuizzerOnlineColour(quizzers, quizzer) {
  if (quizzers.quizzers.includes(quizzer.id)) {
    return "green";
  } else if (quizzers.quizMaster.includes(quizzer.id)) {
    return "blueviolet";
  } else {
    return "grey";
  }
}