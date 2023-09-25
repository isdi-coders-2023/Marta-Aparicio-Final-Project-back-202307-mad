import { WithId } from '../types/id.js';
import { Recipe } from './recipe.js';

export type LoginData = {
  userName: string;
  password: string;
};
type UserNoId = LoginData & {
  email: string;
  recipes: Recipe[];
};

export type User = WithId & UserNoId;
