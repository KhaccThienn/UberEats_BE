/* eslint-disable prettier/prettier */
import { Role } from './role.enum';

export class User {
  id?: number;
  userName?: string;
  password?: string;
  email?: string;
  phone?: string;
  role?: Role[];
}
