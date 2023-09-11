/* eslint-disable prettier/prettier */
import { Expose } from 'class-transformer';
export class UpdateOrderDTO {
  @Expose()
  orderId: number;

  @Expose()
  delivered_address?: string;

  @Expose()
  delivered_phone?: number;

  @Expose()
  delivered_user?: string;

  @Expose()
  note?: string;

  @Expose()
  status?: number;

  @Expose()
  userId?: number;

  @Expose()
  deliverId?: number;

  @Expose()
  estimated_time?: string;

  @Expose()
  delivered_from?: string;
}
