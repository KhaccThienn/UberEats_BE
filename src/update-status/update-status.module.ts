import { Module, forwardRef } from '@nestjs/common';
import { UpdateStatusService } from './update-status.service';
import { UpdateStatusGateway } from './update-status.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/order/entity/order.entity';
import { OrderDetailsModule } from 'src/order_details/order_details.module';
import { ProductModule } from 'src/product/product.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { UserModule } from 'src/user/user.module';
import { VoucherModule } from 'src/voucher/voucher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    forwardRef(() => OrderDetailsModule),
    forwardRef(() => UserModule),
    forwardRef(() => VoucherModule),
    forwardRef(() => ProductModule),
    forwardRef(() => RestaurantModule),
  ],
  providers: [UpdateStatusGateway, UpdateStatusService],
  exports: [TypeOrmModule],
})
export class UpdateStatusModule {}
