import createDebug from 'debug';
import { Recipe } from '../entities/recipe.js';
import { HttpError } from '../types/http.error.js';
import { RecipeModel } from './recipe.model.mongo.js';
import { Repository } from './repository.js';
const debug = createDebug('Proyecto-final:Repo:RecipesMongoRepo');

export class RecipeMongoRepository implements Repository<Recipe> {
  constructor() {
    debug('Instantiated');
  }

  async getAll(): Promise<Recipe[]> {
    const data = await RecipeModel.find()
      .populate('author', {
        userName: 1,
      })
      .exec();
    return data;
  }

  async get(id: string): Promise<Recipe> {
    const data = await RecipeModel.findById(id)
      .populate('author', {
        userName: 1,
      })
      .exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'Recipe not found in file system', {
        cause: 'Trying getById',
      });
    return data;
  }

  async post(newData: Omit<Recipe, 'id'>): Promise<Recipe> {
    const data = await RecipeModel.create(newData);
    return data;
  }

  async patch(id: string, newData: Partial<Recipe>): Promise<Recipe> {
    const data = await RecipeModel.findByIdAndUpdate(id, newData, {
      new: true,
    })
      .populate('author', {
        userName: 1,
      })
      .exec();
    debug(data, 'data');
    if (!data)
      throw new HttpError(404, 'Not Found', 'Recipe not found in file system', {
        cause: 'Trying update',
      });
    return data;
  }

  async delete(id: string): Promise<void> {
    const result = await RecipeModel.findByIdAndDelete(id).exec();
    if (!result)
      throw new HttpError(404, 'Not Found', 'Recipe not found in file system', {
        cause: 'Trying delete',
      });
  }
}
