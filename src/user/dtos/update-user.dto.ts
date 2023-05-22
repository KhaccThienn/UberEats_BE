/* eslint-disable prettier/prettier */
import { Expose } from 'class-transformer';
import { IsNotEmpty, MinLength, IsString } from 'class-validator';

export class UpdateUserDto {
  @MinLength(3)
  @IsString()
  @Expose()
  userName?: string;

  avatar?: string;

  @Expose()
  email?: string;

  @Expose()
  phone?: string;

  @Expose()
  address?: string;

  refresh_token?: string;
}
