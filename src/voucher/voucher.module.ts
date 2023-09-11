/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoucherEntity } from './entity/voucher.entity';
import { RestaurantModule } from 'src/restaurant/restaurant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VoucherEntity]),
    forwardRef(() => RestaurantModule),
  ],
  controllers: [VoucherController],
  providers: [VoucherService],
  exports: [TypeOrmModule],
})
export class VoucherModule {}
