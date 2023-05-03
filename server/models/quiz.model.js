import { db } from "../src/db/db.config.js";
import { DataTypes } from "sequelize";
import { User } from "./user.model.js";

export const Quiz = db.define("quiz", {
  quizTitle: {
    type: DataTypes.STRING(32),
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
    type: DataTypes.STRING(256),
    allowNull: false,
  },
  questionType: {
    type: DataTypes.STRING(8), // "text"/"photo"
    allowNull: false,
    default: "text",
  },
  questionPic: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  answerSelectionType: {
    type: DataTypes.STRING(8), // "single"/"multiple"
    allowNull: false,
    default: "single",
  },
  answers: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: false,
  },
  correctAnswer: {
    type: DataTypes.ARRAY(DataTypes.INTEGER), // To allow multiple answers
    allowNull: false,
  },
  messageForCorrectAnswer: {
    type: DataTypes.STRING(64),
    allowNull: true,
  },
  messageForIncorrectAnswer: {
    type: DataTypes.STRING(64),
    allowNull: true,
  },
  explanation: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  point: {
    type: DataTypes.INTEGER,
    allowNull: false,
    default: 1000,
  },
});
