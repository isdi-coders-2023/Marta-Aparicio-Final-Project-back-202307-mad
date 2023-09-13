import { Router as createRouter } from 'express';
import { UsersController } from '../controller/user.controller.js';

import createDebug from 'debug';
import { UserMongoRepository } from '../repository/user.mongo.repository.js';
const debug = createDebug('Protecto-final:Router:UsersRouter');

debug('Loaded');
const repo = new UserMongoRepository();
const userController = new UsersController(repo);
export const userRouter = createRouter();

userRouter.patch('/login', userController.login.bind(userController));
userRouter.post('/register', userController.register.bind(userController));

userRouter.get('/', userController.getAll.bind(userController));
userRouter.get('/:id', userController.get.bind(userController));
