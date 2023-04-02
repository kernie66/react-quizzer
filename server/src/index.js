#!/usr/bin/env node
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import normalizePort from './utils/normalizePort.js';
import { logger } from './logger/logger.js';
import quizzerDb from './db/db.config.js';
import testDbConnection from './db/testDbConnection.js';

const app = express();
const apiPort = normalizePort(process.env.PORT || '3000');
const db = quizzerDb();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Initializing database...');
  testDbConnection(db);
});

app.listen(apiPort, () =>
  logger.info(`Server running on port ${apiPort}`)
);
