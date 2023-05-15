/* eslint-disable prettier/prettier */
import { Expose } from 'class-transformer';
import { IsNotEmpty, MinLength, IsString, IsEmail } from 'class-validator';
export class UpdateOrderDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  delivered_address?: string;

  @IsNotEmpty()
  @Expose()
  delivered_phone?: number;

  @IsNotEmpty()
  @Expose()
  status?: number;
}
