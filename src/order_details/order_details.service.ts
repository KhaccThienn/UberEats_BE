/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDeatailsEntity } from './entity/order_details.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateOrderDetailsDTO } from './dto/create-order_details.dto';
import { OrderEntity } from 'src/order/entity/order.entity';

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectRepository(OrderDeatailsEntity)
    private readonly orderDetailRepository: Repository<OrderDeatailsEntity>,

    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async create(
    orderId: number,
    orderDetail: CreateOrderDetailsDTO,
  ): Promise<OrderDeatailsEntity> {
    const orders = await this.orderRepository.findOne({
      where: [
        {
          id: orderId,
        },
      ],
    });

    const newOrderDetails = await this.orderDetailRepository.create({
      ...orderDetail,
      orders,
    });
    return await this.orderDetailRepository.save(newOrderDetails);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.orderDetailRepository.delete(id);
  }
}
