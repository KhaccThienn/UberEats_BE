/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateOrderDTO } from './dto/create-order.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { User } from 'src/user/entity/user.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(VoucherEntity)
    private readonly voucherRepository: Repository<VoucherEntity>,
  ) {}

  async getAll(): Promise<OrderEntity[]> {
    return await this.orderRepository.find({
      relations: {
        user: true,
        vouchers: true,
      },
    });
  }

  async getByID(id: number): Promise<OrderEntity> {
    return await this.orderRepository.findOne({
      relations: {
        user: true,
        vouchers: true,
      },
      where: {
        id: id,
      },
    });
  }

  async create(order: CreateOrderDTO): Promise<OrderEntity> {
    const user = await this.userRepository.findOne({
      where: [{ id: order.userId }],
    });

    const vouchers = await this.voucherRepository.findOne({
      where: {
        id: order.vouchersId,
      },
    });

    const newOrder = await this.orderRepository.create({
      ...order,
      user,
      vouchers,
    });
    return await this.orderRepository.save(newOrder);
  }

  async update(
    userID: number,
    id: number,
    order: UpdateOrderDTO,
  ): Promise<UpdateResult> {
    const user = await this.userRepository.findOne({
      where: [{ id: userID }],
    });

    const newOrder = await this.orderRepository.create({
      ...order,
      user,
    });
    return await this.orderRepository.update(id, newOrder);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.orderRepository.delete(id);
  }
}
