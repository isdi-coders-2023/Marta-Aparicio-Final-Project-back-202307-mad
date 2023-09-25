import { Request, Response } from 'express';
import { User } from '../entities/user.js';
import { UserMongoRepository } from '../repository/user.mongo.repository.js';
import { Auth } from '../services/auth.js';
import { UsersController } from './user.controller.js';

describe('UsersController', () => {
  const mockRepo: UserMongoRepository = {
    getAll: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    search: jest.fn(),
  } as unknown as UserMongoRepository;
  const mockNext = jest.fn();

  const usersController = new UsersController(mockRepo);
  describe('happy path', () => {
    test('Should call post and return mockData', async () => {
      const mockData = { id: 1, name: 'Victor' };
      const newData = { email: 'asdhjne' };
      (mockRepo.post as jest.Mock).mockResolvedValue(newData);

      const mockRequest = {} as Request;
      const mockResponse = {
        json: jest.fn().mockResolvedValue(mockData),
      } as unknown as Response;
      const mockNext = jest.fn();

      await usersController.post(mockRequest, mockResponse, mockNext);
      expect(mockRepo.post).toHaveBeenCalled();
    });
    test('should call getAll and return data', async () => {
      const mockData = [{ id: '1', name: 'Victor' }];
      (mockRepo.getAll as jest.Mock).mockResolvedValue(mockData);

      const mockRequest = {} as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();

      await usersController.getAll(mockRequest, mockResponse, mockNext);
      expect(mockRepo.getAll).toHaveBeenCalledWith();
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });
    test('should call getById and return mockData', async () => {
      const mockData = { id: '1' };
      (mockRepo.get as jest.Mock).mockResolvedValue(mockData);

      const mockRequest = {
        params: { id: '1' },
      } as unknown as Request;

      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();

      await usersController.get(mockRequest, mockResponse, mockNext);
      expect(mockRepo.get).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });
    test('should call register and return mockData', async () => {
      const mockData = { passwd: '12234', id: '1', email: 'aso@gmail.com' };
      (mockRepo.post as jest.Mock).mockResolvedValue(mockData);

      Auth.hash = jest.fn().mockResolvedValueOnce(mockData.passwd);

      const mockRequest = {
        body: { passwd: '12345' },
      } as unknown as Request;

      const mockResponse = {
        status: Number,
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();

      await usersController.register(mockRequest, mockResponse, mockNext);
      expect(mockRepo.post).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });
    test('should call patch and return mockData', async () => {
      const mockData = { id: '1', name: 'Víctor' };
      (mockRepo.patch as jest.Mock).mockResolvedValue(mockData);

      const mockRequest = {
        params: { id: '1' },
        body: { name: 'Víctor' },
      } as unknown as Request;

      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();

      await usersController.patch(mockRequest, mockResponse, mockNext);
      expect(mockRepo.patch).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });
    test('when patch if there is a password in the body it should be hashed ', async () => {
      const mockData = { id: '1', name: 'Víctor' };
      (mockRepo.patch as jest.Mock).mockResolvedValue(mockData);
      Auth.hash = jest.fn();

      const mockRequest = {
        params: { id: '1' },
        body: { password: 'Víctor' },
      } as unknown as Request;

      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();

      await usersController.patch(mockRequest, mockResponse, mockNext);
      expect(mockRepo.patch).toHaveBeenCalled();
      expect(Auth.hash).toHaveBeenCalled();
    });
    test('should call login and return mockData', async () => {
      const mockData = [
        {
          id: 'asdfdbg',
        } as unknown as Promise<User>,
      ];

      (mockRepo.search as jest.Mock).mockResolvedValue(mockData);

      const mockRequest = {
        body: { userName: '1', passwd: '1234' },
      } as unknown as Request;

      Auth.compare = jest.fn().mockResolvedValueOnce(Promise<true>);
      Auth.signToken = jest.fn().mockResolvedValueOnce('');

      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await usersController.login(mockRequest, mockResponse, mockNext);
      expect(mockRepo.search).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('errors', () => {
    const mockRepo: UserMongoRepository = {
      getAll: jest.fn().mockRejectedValue(new Error('getAll Error')),
      get: jest.fn().mockRejectedValue(new Error('get Error')),
      post: jest.fn().mockRejectedValue(new Error('post Error')),
      patch: jest.fn().mockRejectedValue(new Error('patch Error')),
      delete: jest.fn().mockRejectedValue(new Error('delete Error')),
      search: jest.fn().mockResolvedValue([]),
    } as unknown as UserMongoRepository;
    const mockNext = jest.fn();

    const userController = new UsersController(mockRepo);

    test('should call getAll and next is call ', async () => {
      const mockRequest = {} as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await userController.getAll(mockRequest, mockResponse, mockNext);
      expect(mockRepo.getAll).toHaveBeenCalledWith();
      expect(mockNext).toHaveBeenCalledWith(new Error('getAll Error'));
    });
    test('should call get and next is call ', async () => {
      const mockRequest = {
        params: { id: 1 },
      } as unknown as Request;

      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await userController.get(mockRequest, mockResponse, mockNext);
      expect(mockRepo.get).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new Error('get Error'));
    });
    test('should call register and next is call ', async () => {
      const mockData = { passwd: '12234', id: '1', email: 'aso@gmail.com' };
      Auth.hash = jest.fn().mockResolvedValueOnce(mockData.passwd);

      const mockRequest = {
        body: { passwd: '12345' },
      } as unknown as Request;

      const mockResponse = {
        status: Number,
        json: jest.fn(),
      } as unknown as Response;

      await userController.register(mockRequest, mockResponse, mockNext);
      expect(mockRepo.post).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new Error('post Error'));
    });
    test('should call patch and next is call ', async () => {
      const mockRequest = {
        params: { id: '1' },
        body: { name: 'Víctor' },
      } as unknown as Request;

      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await userController.patch(mockRequest, mockResponse, mockNext);
      expect(mockRepo.patch).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new Error('patch Error'));
    });
  });
});

describe('Given the class UsersController', () => {
  describe('When theres an error calling the search method during the login', () => {
    test('Then, there should be an error', async () => {
      const mockRepo: UserMongoRepository = {
        search: jest.fn().mockResolvedValue([]),
      } as unknown as UserMongoRepository;
      const userController = new UsersController(mockRepo);
      const mockRequest = {
        body: { email: '', password: '', id: '' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();
      await userController.login(mockRequest, mockResponse, mockNext);
      const thrownError = mockNext.mock.calls[0][0];
      expect(thrownError.message).toBe('Login unauthorized');
    });
  });
});
