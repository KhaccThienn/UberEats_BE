import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDeatailsEntity } from './entity/order_details.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateOrderDetailsDTO } from './dto/create-order_details.dto';

@Injectable()
export class OrderDetailsService {
    constructor(
        @InjectRepository(OrderDeatailsEntity)
        private readonly orderDetailRepository: Repository<OrderDeatailsEntity>,
    ){}

    async create(newOrderDetails: CreateOrderDetailsDTO): Promise<OrderDeatailsEntity>{
        return await this.orderDetailRepository.save(newOrderDetails);
    }

    async delete(id:number): Promise<DeleteResult>{
        return await this.orderDetailRepository.delete(id);
    }
}
