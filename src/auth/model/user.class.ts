/* eslint-disable prettier/prettier */
import { Role } from '../../model/role.enum';

export class User {
  id?: number;
  username?: string;
  password?: string;
  email?: string;
  phone?: string;
  role?: Role[];
}
