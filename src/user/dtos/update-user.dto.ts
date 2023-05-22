/* eslint-disable prettier/prettier */
import { Expose } from 'class-transformer';
import { IsNotEmpty, MinLength, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  @Expose()
  userName?: string;

  avatar?: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  email?: string;

  @IsNotEmpty()
  @Expose()
  phone?: string;

  @Expose()
  address?: string;

  @IsString()
  @Expose()
  password?: string;
  role?: number;
  refresh_token?: string;
}
