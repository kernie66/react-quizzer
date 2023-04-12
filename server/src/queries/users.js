import { User } from '../../models/user.model.js';
import dbCreateUser from '../db/db.createUser.js';
import { logger } from '../logger/logger.js';
import isEmpty from '../utils/isEmpty.js';

export const getUsers = async (req, res) => {
  let users;
  // Use findAll for all to ensure that the result is an array
  if (req.query.id) {
    const userId = parseInt(req.query.id);
    users = await User.findAll({
      where: {
        id: userId,
      },
    });
  } else if (req.query.username) {
    const username = req.query.username;
    users = await User.findAll({
      where: {
        username: username,
      },
    });
  } else if (req.query.name) {
    const name = req.query.name;
    users = await User.findAll({
      where: {
        name: name,
      },
    });
  } else {
    users = await User.findAll();
  }
  logger.info(
    'Number of users found:',
    isEmpty(users) ? 'None' : users.length
  );
  if (!isEmpty(users)) {
    res.status(200).json(users);
  } else {
    res.status(404).send('No matching users found.');
  }
};

export const createUser = async (req, res) => {
  const userData = req.body;
  logger.info('User', userData.name, userData.email, req.body);
  const status = await dbCreateUser(userData);
  if (status) {
    res.status(201).send(`User created for ${userData.name}`);
  } else {
    res
      .status(200)
      .send(
        `User with same info already exist: ${userData.username}`
      );
  }
};

export const deleteUser = async (req, res) => {
  const id = parseInt(req.query.id);
  const user = await User.findByPk(id);
  if (!isEmpty(user)) {
    const done = await user.destroy();
    logger.info('User delete result:', done);
    res.status(200).json(user);
  } else {
    res.status(404).send('No matching user found.');
  }
};
