import { NextFunction, Request, Response } from 'express';
import { Repository } from '../repository/repository.js';
import { Auth } from '../services/auth.js';

export abstract class Controller<T extends { id: string | number }> {
  constructor(protected repo: Repository<T>) {
    this.repo = repo;
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.repo.getAll();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await this.repo.get(id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async post(req: Request, res: Response, next: NextFunction) {
    try {
      const finalItem = await this.repo.post(req.body);
      res.status(201);
      res.json(finalItem);
    } catch (error) {
      next(error);
    }
  }
  async patch(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (req.body.password) {
        req.body.password = await Auth.hash(req.body.passwd);
      }

      const user = await this.repo.patch(id, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await this.repo.delete(id);
      res.status(204);
      res.json({});
    } catch (error) {
      next(error);
    }
  }
}
