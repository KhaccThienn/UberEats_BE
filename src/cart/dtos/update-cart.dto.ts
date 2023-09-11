/* eslint-disable prettier/prettier */
import { Expose } from 'class-transformer';

export class UpdateCartDTO {
  @Expose()
  userId: number;

  @Expose()
  prodId: number;

  @Expose()
  quantity: number;
}
