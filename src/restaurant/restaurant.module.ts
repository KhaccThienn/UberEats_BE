/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from 'src/product/product.module';
import { RestaurantEntity } from './entity/restaurant.entity';
import { UserModule } from 'src/user/user.module';
import { OrderDetailsModule } from 'src/order_details/order_details.module';
import { VoucherModule } from 'src/voucher/voucher.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([RestaurantEntity]),
    forwardRef(() => UserModule),
    forwardRef(()=>ProductModule),
    forwardRef(()=> OrderDetailsModule),
    forwardRef(()=> VoucherModule)

  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [TypeOrmModule],
})
export class RestaurantModule {}
