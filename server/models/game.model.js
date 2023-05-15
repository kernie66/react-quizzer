import { db } from "../src/db/db.config.js";
import { DataTypes } from "sequelize";

export const Game = db.define("game", {
  quizDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  winner: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  second: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  third: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  currentQuestion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  completedQuestions: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});
