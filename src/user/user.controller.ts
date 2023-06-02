/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateResult } from 'typeorm';
import { UpdatePasswordDTO } from './dtos/update-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { unlinkSync } from 'fs';
@ApiTags('User API')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }
  @Get('/emails')
  async getAllUserEmails() {
    return await this.userService.findAllEmailUser();
  }
  @Get('/phones')
  async getAllUserPhones() {
    return await this.userService.findAllPhoneUser();
  }

  @Get(':userID')
  async getUser(@Param('userID') userID: string): Promise<User> {
    return await this.userService.findById(userID);
  }

  @Get('/role/:roleId')
  async getRole(@Param('roleId') roleId: number): Promise<User[]> {
    return await this.userService.findByRole(roleId);
  }

  @Put(':userID')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './src/public/uploads',
        filename(req, file, callback) {
          let filename = Date.now() + file.originalname;
          filename = filename.split(' ').join('_');
          callback(null, filename);
        },
      }),
    }),
  )
  async updateUserData(
    @Req() req: Request,
    @Param('userID') userID: string,
    @Body() userData: UpdateUserDto,
    @UploadedFile()
    image: Express.Multer.File,
  ): Promise<UpdateResult> {
    const user_found = await this.userService.findById(userID);
    console.log('user_found', user_found);
    let avatar_name = user_found.avatar;
    if (image && user_found.avatar != '') {
      const filePath = user_found.avatar.replace(
        'http://localhost:8000/uploads/',
        '',
      );
      unlinkSync('./src/public/uploads/' + filePath);
      avatar_name = `http://${req.get('host')}/uploads/${image.filename}`;
    }
    if (image && user_found.avatar == '') {
      avatar_name = `http://${req.get('host')}/uploads/${image.filename}`;
    }
    // console.log('User Data In Controller: ', userData);
    userData.avatar = avatar_name;
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
