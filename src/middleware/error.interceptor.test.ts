import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { HttpError } from '../types/http.error.js';
import { ErrorMiddleware } from './error.interceptor.js';

describe('Given ErrorMiddleware class', () => {
  describe('When we instantiate it', () => {
    const errorMiddleware = new ErrorMiddleware();
    const mockRequest = {} as Request;
    const mockResponse = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;
    const mockNext = jest.fn();
    test('Then manageError should be used with Error', () => {
      const error = new Error('Test Error');
      errorMiddleware.manageErrors(error, mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'Server Error',
        })
      );
    });

    test('Then manageError should be used with HttpError', () => {
      const error = new HttpError(400, 'Bad Request', 'Test HttpError');
      errorMiddleware.manageErrors(error, mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'Http Error',
        })
      );
    });
    test('ValidationError option', () => {
      const error = new mongoose.Error.ValidationError();
      errorMiddleware.manageErrors(error, mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.statusMessage).toEqual('Bad Request');
      expect.objectContaining({
        type: 'Validation Error',
      });
    });

    test('CastError option', () => {
      const error = new mongoose.Error.CastError('', 400, '');
      errorMiddleware.manageErrors(error, mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'Casting Error',
        })
      );
    });
    test('MongoServerError option', () => {
      const error = new mongoose.mongo.MongoServerError({});
      errorMiddleware.manageErrors(error, mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.statusMessage).toEqual('Not accepted');
    });
  });
});
