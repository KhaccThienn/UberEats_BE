import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderEntity } from './entity/order.entity';
import { CreateOrderDTO } from './dto/create-order.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getAll(): Promise<OrderEntity[]> {
    return await this.orderService.getAll();
  }

  @Get(':id')
  async getByID(@Param('id') id: number):Promise<OrderEntity[]>{
    return await this.orderService.getByID(id);
  }

  @Post()
  async create(@Body() data: CreateOrderDTO): Promise<OrderEntity>{
    return await this.orderService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data:UpdateOrderDTO): Promise<UpdateResult>{
    return await this.orderService.update(id,data);
  }

  @Delete(':id')
  async delete(@Param('id') id:number):Promise<DeleteResult>{
    return await this.orderService.delete(id);
  }
}
