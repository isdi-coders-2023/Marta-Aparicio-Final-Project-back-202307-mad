import { User } from './users.js';

export type Recipe = {
  name: string;
  category: string;
  Ingredients: string;
  Mode: string;
  autor: User;
  img: string;
};
