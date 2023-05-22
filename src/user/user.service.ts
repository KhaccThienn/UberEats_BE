/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import * as argon from 'argon2';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdatePasswordDTO } from './dtos/update-password.dto';
import { RestaurantEntity } from 'src/restaurant/entity/restaurant.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}

  async hashedData(password: string): Promise<string> {
    return await argon.hash(password);
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find({
      relations: {
        restaurant: true,
      },
    });
  }

  async findById(id: string): Promise<User> {
    return this.userRepo.findOne({
      relations: {
        restaurant: true,
      },
      where: [{ id: +id }],
    });
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepo.findOne({
      where: [{ userName: username }],
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    const userData = await this.userRepo.findOne({
      where: {
        id: +id,
      },
    });
    const restaurants = await this.restaurantRepository.findBy({
      user: userData,
    });
    console.log('Users Restaurant Data: ', restaurants);

    // const newUserData = await this.userRepo.create({
    //   ...restaurants,
    //   updateUserDto,
    // });

    return await this.userRepo.update(id, updateUserDto);
  }

  async updatePassword(
    id: string,
    passwordDTO: UpdatePasswordDTO,
  ): Promise<UpdateResult> {
    const user = await this.userRepo.findOneBy({ id: +id });

    const matchPass =
      (await argon.verify(user.password, passwordDTO.old_password)) &&
      passwordDTO.new_password === passwordDTO.confirm_password;

    if (!matchPass) {
      throw new HttpException(
        { status: HttpStatus.FORBIDDEN, error: 'Invalid Account' },
        HttpStatus.FORBIDDEN,
      );
    }

    const newPassword = await this.hashedData(passwordDTO.new_password);

    return await this.userRepo.update(id, {
      password: newPassword,
    });
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.userRepo.delete(+id);
  }
}
