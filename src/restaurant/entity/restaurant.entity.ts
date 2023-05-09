import { ProductEntity } from 'src/product/entity/product.entity';
import { User } from 'src/user/entity/user.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Entity } from 'typeorm';
@Entity('restaurant')
export class RestaurantEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  address: string;

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

  @OneToMany(() => ProductEntity, (product) => product.restaurant)
  products: ProductEntity[];

  @ManyToOne(()=> User,(user)=> user.restaurant)
  user: User;

  @OneToMany(() => VoucherEntity, (voucher) => voucher.restaurant)
  vouchers: VoucherEntity[];
}
