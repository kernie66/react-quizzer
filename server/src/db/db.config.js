import { Sequelize } from '@sequelize/core';
import { logger } from '../logger/logger.js';

const hostName = process.env.HOSTNAME;
const userName = process.env.USERNAME;
const password = process.env.PASSWORD;
const dialect = 'postgres';
const logLevel = process.env.SEQUELIZE_LOG_LEVEL || 'debug';
let database = process.env.DATABASE;

if (process.env.NODE_ENV === 'development') {
  database = database + '_dev';
}
if (process.env.NODE_ENV === 'test') {
  database = database + '_test';
}

export const db = new Sequelize(database, userName, password, {
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
    await db.authenticate();
    logger.info('Connection has been established successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
  }
};
