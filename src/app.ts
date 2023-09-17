import cors from 'cors';
import createDebug from 'debug';
import express from 'express';
import morgan from 'morgan';
import { ErrorMiddleware } from './middleware/error.interceptor.js';
import { recipeRouter } from './router/recipe.router.js';
import { userRouter } from './router/user.router.js';

const debug = createDebug('Proyecto-final:App');

export const app = express();
debug('Started');

app.use(morgan('dev'));
app.use(cors());

app.use(express.json());

app.use(express.static('public'));

app.use('/users', userRouter);
app.use('/recipes', recipeRouter);

const error = new ErrorMiddleware();
app.use(error.manageErrors.bind(error));
