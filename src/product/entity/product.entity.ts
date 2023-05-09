import { OrderDeatailsEntity } from 'src/order_details/entity/order_details.entity';
import { RestaurantEntity } from 'src/restaurant/entity/restaurant.entity';
import { PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Entity } from 'typeorm';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  image: string;

  @Column({
    type: 'float',
    nullable: false,
  })
  price: number;

  @Column({
    type: 'float',
    nullable: true,
    default: 0,
  })
  sale_price: number;

  @Column({
    type: 'tinyint',
    default: 1,
  })
  status: number;

  @Column({
    type: 'text',
  })
  description: string;

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.products)
  restaurant: RestaurantEntity;

  @OneToMany(() => OrderDeatailsEntity, (order_detail) => order_detail.products)
  order_details: OrderDeatailsEntity[];
}