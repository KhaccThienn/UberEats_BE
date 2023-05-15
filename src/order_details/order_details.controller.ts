/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { OrderDetailsService } from './order_details.service';
import { CreateOrderDetailsDTO } from './dto/create-order_details.dto';
import { OrderDeatailsEntity } from './entity/order_details.entity';
import { DeleteResult } from 'typeorm';

@Controller('order-details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @Post(':orderID')
  async create(
    @Param('orderID') orderID: number,
    @Body() data: CreateOrderDetailsDTO,
  ): Promise<OrderDeatailsEntity> {
    return await this.orderDetailsService.create(orderID, data);
  }

  @Delete()
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return await this.orderDetailsService.delete(id);
  }
}
