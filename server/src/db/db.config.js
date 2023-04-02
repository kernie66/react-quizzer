// import 'dotenv/config';
import { Sequelize } from 'sequelize';
import { logger } from '../logger/logger.js';

const hostName = process.env.HOSTNAME;
const userName = process.env.USERNAME;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;
const dialect = 'postgres';
const logLevel = process.env.SEQUELIZE_LOG_LEVEL || 'debug';

export const sq = new Sequelize(database, userName, password, {
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

export const testDbConnection = async () => {
  try {
    await sq.authenticate();
    logger.info('Connection has been established successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
  }
};
