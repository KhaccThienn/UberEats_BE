import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { OrderDetailsModule } from 'src/order_details/order_details.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([OrderEntity]),
    forwardRef(()=> OrderDetailsModule)
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [TypeOrmModule]
})
export class OrderModule {}
