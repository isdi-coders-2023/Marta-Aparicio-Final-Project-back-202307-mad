import bcrypt from 'bcrypt';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { HttpError } from '../types/http.error.js';
import { TokenPayload } from '../types/token.js';

export class Auth {
  static passwd = process.env.TOKEN_PASSWD!;
  static hash(passwd: string) {
    const saltRounds = 10;
    return bcrypt.hash(passwd, saltRounds);
  }

  static compare(passwd: string, hashPasswd: string) {
    const a = bcrypt.compare(passwd, hashPasswd);
    return a;
  }

  static signToken(payload: TokenPayload): string {
    return jwt.sign(payload, Auth.passwd);
  }

  static verifyTokenGettingPayload(token: string) {
    try {
      const result = jwt.verify(token, Auth.passwd);
      if (typeof result === 'string') {
        throw new HttpError(498, 'Not valid token', result);
      }

      return result as TokenPayload;
    } catch (error) {
      throw new HttpError(498, 'Not valid token', (error as Error).message);
    }
  }
}
