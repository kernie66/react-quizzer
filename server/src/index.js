#!/usr/bin/env node
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import normalizePort from './utils/normalizePort.js';
import { logger } from './logger/logger.js';
import { testDbConnection } from './db/db.config.js';
import dbSync from './db/db.sync.js';
import morgan from 'morgan';
import zxcvbn from 'zxcvbn';
import { router } from './routes/index.js';

const invalidPathHandler = (req, res) => {
  res.status(400);
  res.send('Invalid path');
};

export const app = express();
const apiPort = normalizePort(process.env.PORT || '3000');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/api', router);

app.get('/', (req, res) => {
  res.send('Initializing database...');
  testDbConnection();
});

app.get('/sync', (req, res) => {
  dbSync(true);
  res.send('Synchronize database...');
});

app.get('/password', (req, res) => {
  res.send(zxcvbn('audi100'));
});
/*
// Manage users
app.get('/users', getUsers);
app.post('/users', createUser);
app.put('/users', updateUser);
app.delete('/users', deleteUser);
*/
app.use(invalidPathHandler);

app.listen(apiPort, () =>
  logger.info(`Server running on port ${apiPort}`)
);
