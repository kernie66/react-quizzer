import { logger } from '../logger/logger.js';

export default async function testDbConnection(db) {
  try {
    await db.sequelize.authenticate();
    logger.info(
      'Connection to database has been established successfully.'
    );
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
  }
}
/*
  await db.sequelize.sync({ alter: true });
  try {
    const users = await db.users.findAll();
    logger.info('Users:::', users.name);
  } catch (err) {
    logger.error(err);
  }
}
*/
