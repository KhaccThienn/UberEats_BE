/* eslint-disable prettier/prettier */
import { Expose } from 'class-transformer';
import { IsNotEmpty, MinLength, IsString, IsEmail } from 'class-validator';
export class CreateOrderDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  delivered_address: string;

  @IsNotEmpty()
  @Expose()
  delivered_phone: number;

  @IsNotEmpty()
  @Expose()
  status: number;

  userId: number;

  vouchersId?: number;
}
