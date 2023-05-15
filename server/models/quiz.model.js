import { db } from "../src/db/db.config.js";
import { DataTypes } from "sequelize";

export const Quiz = db.define("quiz", {
  quizTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  quizSynopsis: {
    type: DataTypes.STRING(1023),
    allowNull: true,
  },
  nrOfQuestions: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  lastUsed: {
    type: DataTypes.DATE,
  },
});

export const Question = db.define("question", {
  questionNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  questionText: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  questionType: {
    type: DataTypes.STRING(8), // "text"/"photo"
    allowNull: false,
    defaultValue: "text",
  },
  questionPic: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  answerSelectionType: {
    type: DataTypes.STRING(8), // "single"/"multiple"
    allowNull: false,
    defaultValue: "single",
  },
  answers: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  correctAnswer: {
    type: DataTypes.ARRAY(DataTypes.INTEGER), // To allow multiple answers
    allowNull: true,
  },
  messageForCorrectAnswer: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  messageForIncorrectAnswer: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  explanation: {
    type: DataTypes.STRING(1023),
    allowNull: true,
  },
  point: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1000,
  },
});
