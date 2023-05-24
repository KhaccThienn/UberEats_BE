/* eslint-disable prettier/prettier */
import { Expose } from 'class-transformer';
import { IsNotEmpty, MinLength, IsString, IsEmail } from 'class-validator';
import { Cart } from 'src/cart/entity/cart.entity';
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

  @Expose()
  userId: number;

  @Expose()
  vouchersId?: number;

  @Expose()
  carts: [];
}
