/* eslint-disable prettier/prettier */
import { Role } from 'src/auth/model/role.enum';
import { OrderEntity } from 'src/order/entity/order.entity';
import { RestaurantEntity } from 'src/restaurant/entity/restaurant.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  userName: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  avatar: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  address: string;

  @Column({
    type: 'varchar',
  })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CLIENT,
  })
  role: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  refresh_token: string;

  @OneToMany(() => RestaurantEntity, (restaurant) => restaurant.user)
  restaurant: RestaurantEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];
}
