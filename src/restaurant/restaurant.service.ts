import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantEntity } from './entity/restaurant.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateRestaurantDTO } from './dto/create-restaurant.dto';
import { UpdateRestaurantDTO } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}

  async queryBuilder(query: string) {
    return await this.restaurantRepository.createQueryBuilder(query);
  }

  async getAll(): Promise<RestaurantEntity[]> {
    return await this.restaurantRepository.find();
  }

  async getByID(id: number): Promise<RestaurantEntity[]> {
    return await this.restaurantRepository.findBy({ id });
  }

  async create(newRestaurant: CreateRestaurantDTO): Promise<RestaurantEntity> {
    return await this.restaurantRepository.save(newRestaurant);
  }

  async update(
    id: number,
    restaurant: UpdateRestaurantDTO,
  ): Promise<UpdateResult> {
    return await this.restaurantRepository.update(id, restaurant);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.restaurantRepository.delete(id);
  }
}
