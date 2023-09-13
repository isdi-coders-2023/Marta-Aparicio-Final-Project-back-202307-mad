import { NextFunction, Request, Response } from 'express';
import { LoginData, User } from '../entities/user.js';
import { UserMongoRepository } from '../repository/user.mongo.repository.js';
import { Auth } from '../services/auth.js';
import { HttpError } from '../types/http.error.js';
import { TokenPayload } from '../types/token.js';
import { Controller } from './controller.js';

export class UsersController extends Controller<User> {
  constructor(protected repo: UserMongoRepository) {
    super(repo);
  }
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.password = await Auth.hash(req.body.password);
      const user = await this.repo.post(req.body);
      res.status(201);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { userName, password } = req.body as unknown as LoginData;
    const error = new HttpError(401, 'UnAuthorized', 'Login unauthorized');
    try {
      const data = await this.repo.search({ key: 'userName', value: userName });
      if (!data.length) {
        throw error;
      }

      const user = data[0];

      if (!(await Auth.compare(password, user.password))) {
        throw error;
      }
      const payload: TokenPayload = {
        id: user.id,
        userName: user.userName,
      };
      const token = Auth.signToken(payload);
      res.json({ user, token });
    } catch (error) {
      next(error);
    }
  }
}
