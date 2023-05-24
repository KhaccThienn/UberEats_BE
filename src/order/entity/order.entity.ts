/* eslint-disable prettier/prettier */
import { OrderDeatailsEntity } from 'src/order_details/entity/order_details.entity';
import { RestaurantEntity } from 'src/restaurant/entity/restaurant.entity';
import { User } from 'src/user/entity/user.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Entity } from 'typeorm';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  delivered_address: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  delivered_phone: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true, eager: true })
  @JoinColumn({ name: 'driverId' })
  driver: User;

  @Column({
    type: 'tinyint',
    default: 1,
  })
  status: number;

  @Column({
    type: 'float',
  })
  total_price: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToOne(() => VoucherEntity, (voucher) => voucher.orders)
  vouchers: VoucherEntity;

  @OneToMany(() => OrderDeatailsEntity, (order_detail) => order_detail.products)
  order_details: OrderDeatailsEntity[];
}
