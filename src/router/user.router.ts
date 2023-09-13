import { Router as createRouter } from 'express';
import { UsersController } from '../controller/user.controller.js';

import createDebug from 'debug';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { UserMongoRepository } from '../repository/user.mongo.repository.js';
const debug = createDebug('Protecto-final:Router:UsersRouter');

debug('Loaded');
const repo = new UserMongoRepository();
const userController = new UsersController(repo);
const userInterceptor = new AuthInterceptor();
export const userRouter = createRouter();

userRouter.patch('/login', userController.login.bind(userController));
userRouter.post('/register', userController.register.bind(userController));

userRouter.get(
  '/',
  userInterceptor.authorization.bind(userInterceptor),
  userController.getAll.bind(userController)
);
userRouter.get(
  '/:id',
  userInterceptor.authorization.bind(userInterceptor),
  userController.get.bind(userController)
);
