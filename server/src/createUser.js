import { User } from '../models/users.model.js';
import { logger } from './logger/logger.js';

export default async function createUser() {
  const existingUser = await User.findAll({
    where: {
      name: 'Kenneth',
    },
  });

  if (!existingUser) {
    try {
      await User.create({
        name: 'Kenneth',
        email: 'kenta@kernie.net',
      });
      logger.info('Successfully created user');
    } catch (error) {
      logger.error('Failed to create user:', error);
    }
  } else {
    logger.info('User already exist');
  }
}
