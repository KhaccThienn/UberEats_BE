/* eslint-disable prettier/prettier */
import { Role } from './role.enum';

export class User {
  id?: number;
  username?: string;
  password?: string;
  email?: string;
  phone?: string;
  role?: Role[];
}
