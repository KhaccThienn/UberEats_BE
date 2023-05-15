/* eslint-disable prettier/prettier */
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Match } from '../decorators/match.decorator';
export class RegisterDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Expose()
  password: string;

  @IsNotEmpty()
  @IsString()
  @Match('password')
  @Expose()
  confirmPassword: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Expose()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('VN', { message: 'Invalid phone number' })
  @Expose()
  phone: string;

  role: number;
}
