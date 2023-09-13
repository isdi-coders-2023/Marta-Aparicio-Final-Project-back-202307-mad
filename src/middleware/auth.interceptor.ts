import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Repository } from '../repository/repository.js';
import { Auth } from '../services/auth.js';
import { HttpError } from '../types/http.error.js';
import { WithId } from '../types/id.js';

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

  authentication<T extends { id: unknown }>(
    itemsRepo: Repository<T>,
    ownerKey: keyof T
  ) {
    return async (req: Request, _res: Response, next: NextFunction) => {
      debug('Call authentication interceptor');
      const userID = req.body.validatedId;
      const itemID = req.params.id;
      try {
        const item = await itemsRepo.get(itemID);
        const itemOwner = (item[ownerKey] as WithId).id;
        if (itemOwner !== userID) {
          throw new HttpError(403, 'Forbidden', 'Not item owner');
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
