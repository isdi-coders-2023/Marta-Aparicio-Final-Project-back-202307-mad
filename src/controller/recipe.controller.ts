import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Recipe } from '../entities/recipe.js';
import { Repository } from '../repository/repository.js';

import { UserMongoRepository } from '../repository/user.mongo.repository.js';
import { CloudinaryService } from '../services/media.files.js';
import { HttpError } from '../types/http.error.js';
import { Controller } from './controller.js';
const debug = createDebug('W6E:Controller:RecipesController');

export class RecipesController extends Controller<Recipe> {
  cloudinary: CloudinaryService;
  constructor(protected repo: Repository<Recipe>) {
    super(repo);
    this.cloudinary = new CloudinaryService();
    debug('Instantiated');
  }

  async post(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new HttpError(400, 'Bad Request', 'No picture for recipe');
      }
      const { validatedId } = req.body;
      const userRepo = new UserMongoRepository();
      const user = await userRepo.get(validatedId);
      req.body.author = user.id;
      const finalPath = req.file.destination + '/' + req.file!.filename;
      const img = await this.cloudinary.uploadImage(finalPath);
      req.body.img = img;
      const finalRecipe = await this.repo.post(req.body);
      user.recipes.push(finalRecipe);
      userRepo.patch(user.id, user);
      res.status(201);
      res.json(finalRecipe);
    } catch (error) {
      next(error);
    }
  }
  async patch(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.file) {
        const finalPath = req.file.destination + '/' + req.file!.filename;
        const img = await this.cloudinary.uploadImage(finalPath);
        req.body.img = img;
      }
      const { validatedId } = req.body;
      const userRepo = new UserMongoRepository();
      const user = await userRepo.get(validatedId);
      req.body.author = user.id;
      const updatedRecipe = await this.repo.patch(req.body.author, req.body);
      user.recipes.push(updatedRecipe);
      userRepo.patch(user.id, user);
      res.json(updatedRecipe);
      res.status(201);
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { validatedId } = req.body;
      const userRepo = new UserMongoRepository();
      const user = await userRepo.get(validatedId);
      const recipe = await this.repo.get(req.body.author);
      req.body.author = user.id;
      await this.repo.delete(recipe.id);
      res.status(201);
    } catch (error) {
      next(error);
    }
  }
}
