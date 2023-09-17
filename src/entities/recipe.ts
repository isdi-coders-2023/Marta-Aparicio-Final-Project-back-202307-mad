import { WithId } from '../types/id.js';
import { ImgData } from '../types/image.js';
import { User } from './user.js';

export type Recipe = {
  name: string;
  category: 'Legumbres' | 'Pasta' | 'Verdura' | 'Otros' | 'Pescado' | 'Carnes';
  ingredients: string;
  mode: string;
  img: ImgData;
  author: User;
} & WithId;
