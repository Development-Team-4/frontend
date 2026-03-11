import { Category } from '@/entities/category/types';
import { User } from '@/entities/user/types';

export interface IStore {
  users: User[];
  categories: Category[];
}
