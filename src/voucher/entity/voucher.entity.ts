import { OrderEntity } from 'src/order/entity/order.entity';
import { RestaurantEntity } from 'src/restaurant/entity/restaurant.entity';
import { PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Entity } from 'typeorm';

@Entity('voucher')
export class VoucherEntity {
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
        type:'float',
        nullable: false,
    })
    discout: number;

    @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.vouchers)
    restaurant: RestaurantEntity;

    @OneToMany(()=> OrderEntity, (order) => order.vouchers)
    orders: OrderEntity[];
};
