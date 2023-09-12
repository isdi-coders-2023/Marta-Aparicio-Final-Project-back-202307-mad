import { User } from './user.js';

export type Recipe = {
  name: string;
  category: 'Legumbres' | 'Pasta' | 'Verdura' | 'Otros' | 'Pescado' | 'Carnes';
  ingredients: string;
  mode: string;
  img: string;
  author: User;
};
