import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { RecipeMongoRepository } from '../repository/recipe.mongo.repository.js';
import { Auth } from '../services/auth.js';
import { HttpError } from '../types/http.error.js';

const debug = createDebug('Proyecto-final:Middleware:Auth.Interceptor');

debug('Loaded');

export class AuthInterceptor {
  authorization(req: Request, _res: Response, next: NextFunction) {
    debug('Call authorization interceptor');
    try {
      const token = req.get('Authorization')?.split(' ')[1];
      if (!token) {
        throw new HttpError(498, 'Invalid token', 'No token provided');
      }

      const { id } = Auth.verifyTokenGettingPayload(token);
      req.body.validatedId = id;
      debug(id);
      next();
    } catch (error) {
      next(error);
    }
  }

  async authentication(req: Request, _res: Response, next: NextFunction) {
    debug('Call notesAuthentication');
    const userID = req.body.validatedId;
    const recipeID = req.params.id;

    try {
      const recipesRepo = new RecipeMongoRepository();
      const recipe = await recipesRepo.get(recipeID);

      if (recipe.author.id !== userID) {
        const error = new HttpError(403, 'Forbidden', 'Not note owner');
        next(error);
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
