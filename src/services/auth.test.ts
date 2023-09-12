import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HttpError } from '../types/http.error';
import { Auth } from './auth';

describe('Given the class Auth', () => {
  describe('When its methods are called,', () => {
    test('Then method hash() is called', () => {
      bcrypt.hash = jest.fn();
      Auth.hash('');
      expect(bcrypt.hash).toHaveBeenCalled();
    });
    test('Then the password is not correct, should throw an error', () => {
      bcrypt.compare = jest.fn();
      Auth.compare('', '');
      expect(bcrypt.compare).toHaveBeenCalled();
    });
    test('Then, when verifyTokenGettingPayload is called', () => {
      jwt.verify = jest.fn();
      Auth.verifyTokenGettingPayload('mockedToken');
      expect(jwt.verify).toHaveBeenCalled();
    });
    test('Then verifyTokenGettingPayload fail should throw an HttpError for an invalid token', () => {
      jwt.verify = jest.fn().mockReturnValueOnce('');

      const error = new HttpError(498, 'Invalid Token');

      expect(() => Auth.verifyTokenGettingPayload('')).toThrowError(error);
    });
    test('Then when the signToken is called should return a token and token must to be string', () => {
      jwt.sign = jest.fn().mockReturnValue('');
      const payload = { id: '1', userName: '' };
      const token = Auth.signToken(payload);
      expect(typeof token).toBe('string');
    });
  });
});
