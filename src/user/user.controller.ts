/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateResult } from 'typeorm';
import { UpdatePasswordDTO } from './dtos/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':userID')
  async getUser(@Param('userID') userID: string): Promise<User> {
    return await this.userService.findById(userID);
  }

  @Put(':userID')
  async updateUserData(
    @Param('userID') userID: string,
    @Body() userData: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.userService.update(userID, userData);
  }

  @Put('/password/:userID')
  async updatePassword(
    @Param('userID') userID: string,
    @Body() userData: UpdatePasswordDTO,
  ): Promise<UpdateResult> {
    return await this.userService.updatePassword(userID, userData);
  }
}
