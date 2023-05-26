/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { OrderDetailsService } from './order_details.service';
import { CreateOrderDetailsDTO } from './dto/create-order_details.dto';
import { OrderDeatailsEntity } from './entity/order_details.entity';
import { DeleteResult } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Order Details API')
@Controller('order_details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @Get(':orderId')
  async getAllByOrder(@Param('orderId') orderId: number) {
    return this.orderDetailsService.getAllByOrderId(orderId);
  }
}
