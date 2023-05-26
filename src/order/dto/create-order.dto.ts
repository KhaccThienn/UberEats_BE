/* eslint-disable prettier/prettier */
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { OrderDeatailsEntity } from 'src/order_details/entity/order_details.entity';
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
  delivered_user: string;

  @Expose()
  note: string;

  @IsNotEmpty()
  @Expose()
  status: number;

  @Expose()
  userId: number;

  @Expose()
  vouchersId: number;

  @Expose()
  restaurantId: number;

  @Expose()
  total_price: number;

  @Expose()
  carts: OrderDeatailsEntity[];
}
