import md5 from "blueimp-md5";
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
    get() {
      return "******";
    },
  },
  nicknames: {
    type: DataTypes.ARRAY(DataTypes.STRING(32)),
  },
  avatar_url: {
    type: DataTypes.VIRTUAL,
    get() {
      const hash = md5(this.email);
      return `https://www.gravatar.com/avatar/${hash}?d=wavatar`;
    },
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  numberOfWins: {
    type: DataTypes.INTEGER,
  },
  lastSeen: {
    type: DataTypes.DATE,
  },
  lastPlayed: {
    type: DataTypes.DATE,
  },
  lastHosted: {
    type: DataTypes.DATE,
  },
});
