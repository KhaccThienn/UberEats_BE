/* eslint-disable prettier/prettier */
import { Role } from 'src/model/role.enum';

/* eslint-disable prettier/prettier */
export class CreateUserDto {
  userName: string;
  avatar?: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  role: number;
  refresh_token?: string;
}
