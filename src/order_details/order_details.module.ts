/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { OrderDetailsService } from './order_details.service';
import { OrderDetailsController } from './order_details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDeatailsEntity } from './entity/order_details.entity';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { OrderModule } from 'src/order/order.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderDeatailsEntity]),
    forwardRef(() => OrderModule),
    forwardRef(() => ProductModule),
  ],
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService],
  exports: [TypeOrmModule],
})
export class OrderDetailsModule {}
