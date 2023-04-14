import { col, fn } from '@sequelize/core';
import { User } from '../../models/user.model.js';
import dbCreateUser from '../db/db.createUser.js';
import { logger } from '../logger/logger.js';
import isEmpty from '../utils/isEmpty.js';

async function parseUser(req) {
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
  return users;
}

export const getUsers = async (req, res) => {
  const users = await parseUser(req);
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

export const updateUser = async (req, res) => {
  const userData = await parseUser(req);
  if (!isEmpty(userData)) {
    try {
      const user = userData[0];
      user.name = req.body.name;
      user.email = req.body.email;
      const updatedUser = await user.save();
      if (req.body.nickname) {
        if (!user.nicknames.includes(req.body.nickname)) {
          await user.update({
            nicknames: fn(
              'array_append',
              col('nicknames'),
              req.body.nickname
            ),
          });
        } else {
          logger.debug('Nickname already exist:', req.body.nickname);
        }
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json(error);
    }
  } else {
    res.status(404).send('No matching user found.');
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
