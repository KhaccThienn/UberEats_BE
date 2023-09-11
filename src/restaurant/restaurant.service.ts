/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantEntity } from './entity/restaurant.entity';
import { DeleteResult, Not, Repository, UpdateResult } from 'typeorm';
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

  async getAllRestaurantNameExceptOne(id: number): Promise<RestaurantEntity[]> {
    const restaurants = await this.restaurantRepository.find({
      where: { id: Not(id) },
    });
    const restaurants_names = [];
    restaurants.forEach((element) => {
      restaurants_names.push(element.name);
    });
    return restaurants_names;
  }

  async getAllRestaurantPhoneExceptOne(
    id: number,
  ): Promise<RestaurantEntity[]> {
    const restaurants = await this.restaurantRepository.find({
      where: { id: Not(id) },
    });
    const restaurants_phones = [];
    restaurants.forEach((element) => {
      restaurants_phones.push(element.phone);
    });
    return restaurants_phones;
  }

  async getAllRestaurantEmailsExceptOne(
    id: number,
  ): Promise<RestaurantEntity[]> {
    const restaurants = await this.restaurantRepository.find({
      where: { id: Not(id) },
    });
    const restaurants_emails = [];
    restaurants.forEach((element) => {
      restaurants_emails.push(element.email);
    });
    return restaurants_emails;
  }

  async getAllRestaurantAddressExceptOne(
    id: number,
  ): Promise<RestaurantEntity[]> {
    const restaurants = await this.restaurantRepository.find({
      where: { id: Not(id) },
    });
    const restaurants_adds = [];
    restaurants.forEach((element) => {
      restaurants_adds.push(element.address);
    });
    return restaurants_adds;
  }

  async getAllRestaurantPhone() {
    const restaurants = await this.restaurantRepository.find();
    console.log(restaurants);

    const restaurants_phones = [];
    restaurants.forEach((element) => {
      restaurants_phones.push(element.phone);
    });
    return restaurants_phones;
  }

  async getAllRestaurantEmail() {
    const restaurants = await this.restaurantRepository.find();
    const restaurants_emails = [];
    restaurants.forEach((element) => {
      restaurants_emails.push(element.email);
    });
    console.log('restaurants_emails', restaurants_emails);

    return restaurants_emails;
  }

  async getAllRestaurantAddress() {
    const restaurants = await this.restaurantRepository.find();
    const restaurants_adds = [];
    restaurants.forEach((element) => {
      restaurants_adds.push(element.address);
    });
    return restaurants_adds;
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
