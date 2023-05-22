/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantEntity } from './entity/restaurant.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateRestaurantDTO } from './dto/create-restaurant.dto';
import { UpdateRestaurantDTO } from './dto/update-restaurant.dto';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async queryBuilder(query: string) {
    return await this.restaurantRepository.createQueryBuilder(query);
  }

  async getAll(): Promise<RestaurantEntity[]> {
    return await this.restaurantRepository.find();
  }
  async getByID(id: number): Promise<RestaurantEntity> {
    return await this.restaurantRepository.findOne({
      where: [{ id: id }],
      relations: ['products'],
    });
  }

  async create(
    userID: number,
    restaurant: CreateRestaurantDTO,
  ): Promise<RestaurantEntity> {
    const user = await this.userRepository.findOne({
      where: [{ id: userID }],
    });

    const newRestaurant = this.restaurantRepository.create({
      ...restaurant,
      user,
    });

    return await this.restaurantRepository.save(newRestaurant);
  }

  async update(
    userId: number,
    id: number,
    restaurant: UpdateRestaurantDTO,
  ): Promise<UpdateResult> {
    const user = await this.userRepository.findOne({
      where: [{ id: userId }],
    });

    const newRestaurant = this.restaurantRepository.create({
      ...restaurant,
      user,
    });
    return await this.restaurantRepository.update(id, newRestaurant);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.restaurantRepository.delete(id);
  }
}
