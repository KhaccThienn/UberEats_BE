/* eslint-disable prettier/prettier */
import { ProductEntity } from 'src/product/entity/product.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'integer',
  })
  id: number;

  @Column({
    type: 'integer',
    name: 'quantity',
  })
  quantity: number;

  @Column({
    type: 'float',
    name: 'total',
  })
  total: number;

  @ManyToOne(() => User, (user) => user.carts)
  user: User;

  @ManyToOne(() => ProductEntity, (product) => product.carts)
  product: ProductEntity;
}
