import { db } from '../src/db/db.config.js';
import { DataTypes } from '@sequelize/core';

export const User = db.define('user', {
  name: {
    type: DataTypes.STRING(32),
    allowNull: false,
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
    validate: {
      is: /^[0-9a-f]{64}$/i,
    },
  },
  nicknames: {
    type: DataTypes.ARRAY(DataTypes.STRING(32)),
  },
  lastSeen: {
    type: DataTypes.DATE,
  },
});
