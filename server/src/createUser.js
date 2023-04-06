import { User } from '../models/user.model.js';
import { logger } from './logger/logger.js';

export default async function createUser(userData) {
  const existingUser = JSON.parse(
    JSON.stringify(
      await User.findAll({
        where: {
          email: userData.email,
        },
      })
    )
  );

  logger.info('Logger:', existingUser ? existingUser : 'No data');

  if (existingUser.length === 0) {
    const lastSeen = new Date();
    try {
      const newUser = await User.create({
        name: userData.name,
        email: userData.email,
        // nicknames: userData.nickname,
        lastSeen: lastSeen,
      });
      if (userData.nicknames) {
        let nicknames = [];
        nicknames.push(userData.nicknames);
        newUser.update({
          nicknames: nicknames,
        });
      }
      logger.info('Successfully created user', userData.name);
      return true;
    } catch (error) {
      logger.error('Failed to create user:', error);
    }
  } else {
    logger.info(
      'User with same email already exist:',
      existingUser[0].name
    );
  }
  return false;
}
