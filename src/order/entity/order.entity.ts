/* eslint-disable prettier/prettier */
import { Status } from 'src/model/status.enum';
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

  @Column({
    type: 'datetime',
    nullable: true,
    // default: Date.now(),
  })
  created_at: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  delivered_user: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  note: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true, eager: true })
  @JoinColumn({ name: 'driverId' })
  driver: User;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
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

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.orders)
  restaurant: RestaurantEntity;

  @OneToMany(
    () => OrderDeatailsEntity,
    (order_detail) => order_detail.product,
    {
      cascade: true,
    },
  )
  order_details: OrderDeatailsEntity[];
}
