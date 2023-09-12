import { WithId } from '../types/id.js';
import { Recipe } from './recipies.js';

type LoginData = {
  userName: string;
  password: string;
};
type UserNoId = LoginData & {
  firstName: string;
  lastName: string;
  email: string;
  recipies: Recipe[];
};

export type User = WithId & UserNoId;
