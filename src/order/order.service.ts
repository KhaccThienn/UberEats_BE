import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateOrderDTO } from './dto/create-order.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
    ){}

    async getAll(): Promise<OrderEntity[]>{
        return await this.orderRepository.find();
    }

    async getByID(id:number): Promise<OrderEntity[]>{
        return await this.orderRepository.findBy({id});
    }

    async create(newOrder: CreateOrderDTO): Promise<OrderEntity>{
        return await this.orderRepository.save(newOrder);
    }

    async update(id: number, order: UpdateOrderDTO): Promise<UpdateResult>{
        return await this.orderRepository.update(id,order);
    }

    async delete(id:number): Promise<DeleteResult>{
        return await this.orderRepository.delete(id);
    }
}
