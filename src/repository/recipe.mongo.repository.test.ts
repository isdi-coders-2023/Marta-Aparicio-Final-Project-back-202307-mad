import { Recipe } from '../entities/recipe.js';
import { RecipeModel } from './recipe.model.mongo.js';
import { RecipeMongoRepository } from './recipe.mongo.repository.js';

// jest.mock('fs/promises');
describe('Given the class RecipeMongoRepository', () => {
  describe('When we instance it', () => {
    const mockData = {
      id: '1',
    } as Recipe;
    const mockExec = jest.fn().mockResolvedValue([mockData]);

    RecipeModel.find = jest.fn().mockReturnValueOnce({
      populate: jest.fn().mockReturnValue({
        exec: mockExec,
      }),
      exec: mockExec,
    });

    const mockExecById = jest.fn().mockResolvedValue(mockData);
    RecipeModel.findById = jest.fn().mockReturnValueOnce({
      populate: jest.fn().mockReturnValue({
        exec: mockExecById,
      }),
      exec: mockExecById,
    });

    RecipeModel.create = jest.fn().mockReturnValue(mockData);
    RecipeModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
      populate: jest.fn().mockReturnValue({
        exec: mockExecById,
      }),
      exec: mockExecById,
    });
    RecipeModel.findByIdAndDelete = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue('ok') });
    const repo = new RecipeMongoRepository();
    test('Then getAll should return data', async () => {
      const result = await repo.getAll();
      expect(result).toEqual([mockData]);
    });
    test('Then get should return data', async () => {
      const result = await repo.get('');
      expect(result).toEqual(mockData);
    });
    test('Then patch should return data', async () => {
      const result = await repo.patch(mockData.id, mockData);
      expect(result).toEqual(mockData);
    });
    test('Then delete should return data', async () => {
      const result = await repo.delete(mockData.id);
      expect(result).toEqual(undefined);
    });
    test('Then post should return data', async () => {
      const result = await repo.post(mockData);
      expect(result).toEqual(mockData);
    });
  });
  describe('When we instance it', () => {
    const mockData = {} as Recipe;

    const repo = new RecipeMongoRepository();
    test('Then get should return error', async () => {
      const mockExecById = jest.fn().mockResolvedValue(null);
      RecipeModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          exec: mockExecById,
        }),
        exec: mockExecById,
      });
      expect(repo.get('')).rejects.toThrow();
    });
    test('Then patch should return error', async () => {
      const mockExecById = jest.fn().mockResolvedValue(null);
      RecipeModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          exec: mockExecById,
        }),
        exec: mockExecById,
      });
      expect(repo.patch('', mockData)).rejects.toThrow();
    });
    test('Then delete should return error', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      RecipeModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: mockExec,
      });
      expect(repo.delete('')).rejects.toThrow();
    });
  });
  describe('When we instance it', () => {
    test('toJSON method should transform the returned object', () => {
      const recipeData = {
        recipename: 'testrecipe',
        password: 'password123',
      };
      const recipe = new RecipeModel(recipeData);
      const recipeObject = recipe.toJSON();
      expect(recipeObject).not.toHaveProperty('_id');
      expect(recipeObject).not.toHaveProperty('__v');
      expect(recipeObject).not.toHaveProperty('password');
      expect(recipeObject).toHaveProperty('id');
    });
  });
});
