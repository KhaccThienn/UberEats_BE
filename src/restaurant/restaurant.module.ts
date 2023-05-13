import { Module, forwardRef } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from 'src/product/product.module';
import { RestaurantEntity } from './entity/restaurant.entity';
import { OrderDetailsModule } from 'src/order_details/order_details.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestaurantEntity]),
    forwardRef(()=>ProductModule),
    forwardRef(()=> OrderDetailsModule)
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [TypeOrmModule]
})
export class RestaurantModule {}
