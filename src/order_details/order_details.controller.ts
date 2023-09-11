/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { OrderDetailsService } from './order_details.service';
import { CreateOrderDetailsDTO } from './dto/create-order_details.dto';
import { OrderDeatailsEntity } from './entity/order_details.entity';
import { DeleteResult } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
@ApiTags('Order Details API')
@Controller('order_details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @Get(':orderId')
  async getAllByOrder(@Param('orderId') orderId: number) {
    return this.orderDetailsService.getAllByOrderId(orderId);
  }

  @Get()
  async getAllByParams(@Req() req: Request) {
    const builder = await this.orderDetailsService
      .queryBuilder('order-details')
      .leftJoinAndSelect('order-details.orders', 'order')
      .innerJoinAndSelect('order-details.product', 'product');
    if (req.query.orderId) {
      const orderId = req.query.orderId;
      builder.andWhere(`order.id = ${orderId}`);
    }
    console.log(await builder.getQuery());
    return await builder.getMany();
  }
}
