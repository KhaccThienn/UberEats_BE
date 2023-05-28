/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderEntity } from './entity/order.entity';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateOrderDTO } from './dto/create-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
@ApiTags('Order API')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // @Get()
  // async getAll(): Promise<OrderEntity[]> {
  //   return await this.orderService.getAll();
  // }

  @Get()
  async getAll(@Req() req: Request): Promise<OrderEntity[]> {
    // return await this.voucherService.getAll();
    const builder = await this.orderService
      .queryBuilder('order')
      .innerJoinAndSelect('order.user', 'orderUser')
      .leftJoinAndSelect('order.vouchers', 'voucher')
      .leftJoinAndSelect('order.restaurant', 'restaurant')
      .leftJoinAndSelect('restaurant.user', 'user')
      .leftJoinAndSelect('order.order_details', 'orderDetails');

    // search
    if (req.query.keyWord) {
      builder.andWhere(`voucher.name LIKE '%${req.query.keyWord}%'`);
    }

    // filter
    if (req.query.sort) {
      const sortQuery = req.query.sort;
      const sortArr = sortQuery.toString().split('-');
      builder.orderBy(
        `voucher.${sortArr[0]}`,
        sortArr[1] == 'ASC' ? 'ASC' : 'DESC',
      );
    }

    if (req.query.orderUser) {
      const cateID = +req.query.orderUser;
      builder.andWhere(`orderUser.id = ${cateID}`);
    }

    if (req.query.orderId) {
      const orderId = +req.query.orderId;
      builder.andWhere(`order.id = ${orderId}`);
    }

    // filter by restaurant
    if (req.query.restaurantID) {
      const cateID = +req.query.restaurantID;
      builder.andWhere('restaurant.id = :resID', { cateID });
    }

    if (req.query.status) {
      const status = req.query.status;
      builder.andWhere(`order.status > ${status}`);
    }

    // paginate
    if (req.query.page || req.query.limit) {
      const page: number = parseInt(req.query.page as any) || 1;
      const perpage: number = parseInt(req.query.limit as any) || 2;

      builder.offset((page - 1) * perpage).limit(perpage);
    }

    console.log(await builder.getQuery());
    return await builder.getMany();
  }

  @Get(':id')
  async getByID(@Param('id') id: number): Promise<OrderEntity> {
    return await this.orderService.getByID(id);
  }

  @Post()
  async create(@Body() data: CreateOrderDTO) {
    return await this.orderService.create(data);
  }

  @Put(':id/:userID')
  async update(
    @Param('userID') userID: number,
    @Param('id') id: number,
    @Body() data: UpdateOrderDTO,
  ): Promise<UpdateResult> {
    return await this.orderService.update(userID, id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return await this.orderService.delete(id);
  }
}
