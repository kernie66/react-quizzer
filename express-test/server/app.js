import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import { URL } from 'url';

const app = express();
// global.__dirname = path.resolve('./');
const __dirname = new URL('.', import.meta.url).pathname;
// const publicPath = new URL('.', __dirname).pathname;
console.log(decodeURIComponent(__dirname)); //, publicPath);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

export default app;
