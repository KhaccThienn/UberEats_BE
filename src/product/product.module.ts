import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { OrderDetailsModule } from 'src/order_details/order_details.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    forwardRef(()=> RestaurantModule),
    forwardRef(()=> OrderDetailsModule)
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [TypeOrmModule]
})
export class ProductModule {}
