// import 'dotenv/config';
import { Sequelize } from 'sequelize';
import usersModel from '../../models/users.model.js';
import { logger } from '../logger/logger.js';

export default function quizzerDb() {
  const hostName = process.env.HOSTNAME;
  const userName = process.env.USERNAME;
  const password = process.env.PASSWORD;
  const database = process.env.DATABASE;
  const dialect = 'postgres';
  const logLevel = process.env.SEQUELIZE_LOG_LEVEL || 'debug';

  const sequelize = new Sequelize(database, userName, password, {
    host: hostName,
    dialect: dialect,
    pool: {
      max: 10,
      min: 0,
      acquire: 20000,
      idle: 5000,
    },
    logging: (msg) =>
      logger.log(logLevel, msg, { service: 'Postgres' }),
  });

  const db = {};
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;
  db.users = usersModel(db);

  return db;
}
