/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findById(id: string): Promise<User> {
    return this.userRepo.findOne({
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
    return await this.userRepo.update(id, updateUserDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.userRepo.delete(+id);
  }
}
