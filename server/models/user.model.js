import { db } from "../src/db/db.config.js";
import { DataTypes } from "sequelize";

export const User = db.define("user", {
  name: {
    type: DataTypes.STRING(32),
    allowNull: true,
  },
  username: {
    type: DataTypes.STRING(16),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  hashedPassword: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  nicknames: {
    type: DataTypes.ARRAY(DataTypes.STRING(32)),
  },
  lastSeen: {
    type: DataTypes.DATE,
  },
});
