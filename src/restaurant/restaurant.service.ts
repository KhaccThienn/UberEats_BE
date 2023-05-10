import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantEntity } from './entity/restaurant.entity';
import { Repository } from 'typeorm';
import { CreateRestaurantDTO } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>
    ){}

    async create(newRestaurant: CreateRestaurantDTO): Promise<RestaurantEntity>{
        return await this.restaurantRepository.save(newRestaurant);
    }
}
