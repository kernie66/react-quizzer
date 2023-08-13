import { DataTypes } from "sequelize";
import { db } from "../src/db/db.config.js";

export const Token = db.define("token", {
  token: { type: DataTypes.STRING(300) },
});
