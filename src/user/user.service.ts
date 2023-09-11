/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import * as argon from 'argon2';
import { DeleteResult, Not, Repository, UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdatePasswordDTO } from './dtos/update-password.dto';
import { RestaurantEntity } from 'src/restaurant/entity/restaurant.entity';
import { Role } from 'src/model/role.enum';

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
  async findAllEmailUser() {
    const users = await this.userRepo.find();
    const emails = [];
    users.forEach((element) => {
      emails.push(element.email);
    });
    return emails;
  }
  async findAllPhoneUser() {
    const users = await this.userRepo.find();
    const phones = [];
    users.forEach((element) => {
      phones.push(element.phone);
    });
    return phones;
  }
  async findAllEmailUserExceptedOne(id: number) {
    const users = await this.userRepo.find({
      where: { id: Not(id) },
    });
    const emails = [];
    users.forEach((element) => {
      emails.push(element.email);
    });
    return emails;
  }
  async findAllPhoneUserExceptedOne(id: number) {
    const users = await this.userRepo.find({
      where: { id: Not(id) },
    });
    const phones = [];
    users.forEach((element) => {
      phones.push(element.phone);
    });
    return phones;
  }

  async findByRole(roleId: number): Promise<User[]> {
    return this.userRepo.find({
      relations: {
        restaurant: true,
      },
      where: {
        role: roleId,
      },
    });
  }

  async findById(id: string): Promise<User> {
    return this.userRepo.findOne({
      relations: {
        restaurant: true,
        carts: true,
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
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Old Password does not match',
        },
        HttpStatus.UNAUTHORIZED,
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
