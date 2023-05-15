/* eslint-disable prettier/prettier */
import { Role } from 'src/auth/model/role.enum';

/* eslint-disable prettier/prettier */
export class CreateUserDto {
  username: string;
  avatar?: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  role: number;
  refresh_token?: string;
}
