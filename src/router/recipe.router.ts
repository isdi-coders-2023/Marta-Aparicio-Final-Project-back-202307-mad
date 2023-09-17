import createDebug from 'debug';
import { Router as createRouter } from 'express';
import { RecipesController } from '../controller/recipe.controller.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FilesInterceptor } from '../middleware/files.interceptor.js';
import { RecipeMongoRepository } from '../repository/recipe.mongo.repository.js';
const debug = createDebug('Protecto-final:Router:UsersRouter');

debug('Loaded');
const repo = new RecipeMongoRepository();
const recipeController = new RecipesController(repo);
const authInterceptor = new AuthInterceptor();
const fileInterceptor = new FilesInterceptor();
export const recipeRouter = createRouter();

recipeRouter.post(
  '/',
  fileInterceptor.singleFileStore.bind(fileInterceptor),
  authInterceptor.authorization.bind(authInterceptor),
  recipeController.post.bind(recipeController)
);
recipeRouter.patch(
  '/',
  authInterceptor.authorization.bind(authInterceptor),
  authInterceptor.authentication.bind(authInterceptor),
  fileInterceptor.singleFileStore.bind(fileInterceptor),
  recipeController.patch.bind(recipeController)
);
recipeRouter.delete(
  '/',
  authInterceptor.authorization.bind(authInterceptor),
  authInterceptor.authentication.bind(authInterceptor),
  recipeController.delete.bind(recipeController)
);

recipeRouter.get('/', recipeController.getAll.bind(recipeController));
recipeRouter.get('/:id', recipeController.get.bind(recipeController));
