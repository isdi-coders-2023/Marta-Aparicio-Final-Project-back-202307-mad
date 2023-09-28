import { Request, Response } from 'express';
import { Recipe } from '../entities/recipe';
import { RecipeMongoRepository } from '../repository/recipe.mongo.repository';
import { UserMongoRepository } from '../repository/user.mongo.repository';
import { CloudinaryService } from '../services/media.files';
import { ImgData } from '../types/image';
import { RecipesController } from './recipe.controller';

jest.mock('../repository/user.mongo.repository');

describe('RecipesController', () => {
  const mockRepo: RecipeMongoRepository = {
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  } as unknown as RecipeMongoRepository;

  const mockNext = jest.fn();
  const recipesController = new RecipesController(mockRepo);
  describe('Given recipe controller', () => {
    test('should call method post, mockRepor.post, cloudinary... ', async () => {
      UserMongoRepository.prototype.get = jest
        .fn()
        .mockResolvedValue({ id: '1', recipes: [] });

      const cloudinary = (CloudinaryService.prototype.uploadImage = jest.fn());
      const mockData = { name: 'test' } as Recipe;
      (mockRepo.post as jest.Mock).mockResolvedValue(mockData);

      const mockRequest = {
        body: { author: '1', validatedId: '1', img: {} as ImgData },
        file: { destination: '', filename: 'test' },
      } as unknown as Request;

      UserMongoRepository.prototype.patch = jest.fn().mockResolvedValue({});
      const mockResponse = {
        status: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;

      await recipesController.post(mockRequest, mockResponse, mockNext);
      expect(mockRepo.post).toHaveBeenCalled();
      expect(cloudinary).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });
    test('should call patch and return mockData', async () => {
      const mockData = { id: '1' };
      (mockRepo.patch as jest.Mock).mockResolvedValueOnce(mockData);

      const mockRequest = {
        params: { id: '1' },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;

      await recipesController.patch(mockRequest, mockResponse, mockNext);
      expect(mockRepo.patch).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });

    test('should call delete and return mockData', async () => {
      const mockData = { id: '1' };
      (mockRepo.delete as jest.Mock).mockResolvedValue(mockData);

      const mockRequest = {
        params: { id: '1' },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;

      await recipesController.delete(mockRequest, mockResponse, mockNext);
      expect(mockRepo.delete).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });
  });
});
describe('RecipesController', () => {
  const mockRepo: RecipeMongoRepository = {
    post: jest.fn().mockRejectedValue(new Error('post Error')),
    patch: jest.fn().mockRejectedValue(new Error('patch Error')),
    delete: jest.fn().mockRejectedValue(new Error('delete Error')),
  } as unknown as RecipeMongoRepository;
  const mockNext = jest.fn();
  const recipesController = new RecipesController(mockRepo);
  describe('errors', () => {
    test('should call post and next is called', async () => {
      const mockRequest = { file: null } as unknown as Request;

      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await recipesController.post(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    test('Should call patch and next is called', async () => {
      const mockRequest = {
        body: { image: {} },
        params: '',
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();
      await recipesController.patch(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
    test('should call delete and next is called', async () => {
      const mockRequest = {
        params: {},
      } as unknown as Request;

      const mockResponse = {} as unknown as Response;

      await recipesController.delete(mockRequest, mockResponse, mockNext);
      expect(mockRepo.delete).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new Error('delete Error'));
    });
  });
});
