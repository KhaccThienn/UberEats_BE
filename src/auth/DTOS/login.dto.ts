/* eslint-disable prettier/prettier */
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Expose()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  password: string;
}
