import { Op } from '@sequelize/core';
import { User } from '../../models/user.model.js';
import { logger } from '../logger/logger.js';
import isEmpty from '../utils/isEmpty.js';

export default async function dbCreateUser(userData) {
  const lowerCaseEmail = userData.email.trim().toLowerCase();
  const existingUser = JSON.parse(
    JSON.stringify(
      await User.findAll({
        where: {
          [Op.or]: [
            {
              email: lowerCaseEmail,
            },
            { username: userData.username },
          ],
        },
      })
    )
  );

  logger.info(
    'Existing user:',
    isEmpty(existingUser) ? 'No data' : existingUser
  );

  if (isEmpty(existingUser)) {
    const lastSeen = new Date();
    try {
      const newUser = await User.create({
        name: userData.name,
        email: lowerCaseEmail,
        username: userData.username,
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
      'User with same info already exist:',
      existingUser[0].name
    );
  }
  return false;
}
