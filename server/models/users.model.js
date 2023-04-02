import { DataTypes } from 'sequelize';

export default function usersModel(db) {
  const userModel = db.sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return userModel;
}
