/* eslint-disable prettier/prettier */
import { PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from 'src/order/entity/order.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { Column, ManyToOne } from 'typeorm';
import { Entity } from 'typeorm';
import { RestaurantEntity } from 'src/restaurant/entity/restaurant.entity';

@Entity('order-details')
export class OrderDeatailsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  price: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  quantity: number;

  @ManyToOne(() => ProductEntity, (product) => product.order_details)
  products: ProductEntity;

  @ManyToOne(() => OrderEntity, (order) => order.order_details)
  orders: OrderEntity;
}
