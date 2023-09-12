import { WithId } from '../types/id';
import { Recipies } from './recipies';

type LoginData = {
  userName: string;
  password: string;
};
type UserNoId = LoginData & {
  firstName: string;
  lastName: string;
  email: string;
  recipies: Recipies[];
};

export type User = WithId & UserNoId;
