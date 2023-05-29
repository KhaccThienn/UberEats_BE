/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDTO } from './dto/create-restaurant.dto';
import { RestaurantEntity } from './entity/restaurant.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateRestaurantDTO } from './dto/update-restaurant.dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/auth/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Restaurant API')
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  async getAll(@Req() req: Request): Promise<RestaurantEntity[]> {
    const builder = (await this.restaurantService.queryBuilder('restaurant'))
      .leftJoinAndSelect('restaurant.products', 'product')
      .leftJoinAndSelect('restaurant.vouchers', 'voucher');

    // search
    if (req.query.keyWord) {
      builder.andWhere(`restaurant.name LIKE '%${req.query.keyWord}%'`);
    }

    // filter
    if (req.query.sort) {
      const sortQuery = req.query.sort;
      const sortArr = sortQuery.toString().split('-');
      builder.orderBy(
        `product.${sortArr[0]}`,
        sortArr[1] == 'ASC' ? 'ASC' : 'DESC',
      );
    }
    //paginate
    const page: number = parseInt(req.query.page as any) || 1;
    const perpage: number = parseInt(req.query.limit as any) || 9;

    builder.offset((page - 1) * perpage).limit(perpage);
    return builder.getMany();
  }

  @Get(':id-:slugs')
  async getByIDAndSlugs(
    @Param('id') id: number,
    @Param('slugs') slugs: string,
    @Req() req: Request,
  ): Promise<RestaurantEntity> {
    const builder = (await this.restaurantService.queryBuilder('restaurant'))
      .leftJoinAndSelect('restaurant.products', 'product')
      .leftJoinAndSelect('restaurant.vouchers', 'voucher')
      .andWhere(`restaurant.id = ${id}`);
    // search
    if (req.query.keyWord) {
      builder.andWhere(`product.name LIKE '%${req.query.keyWord}%'`);
    }
    if (req.query.status) {
      const status = +req.query.status;
      builder.andWhere(`product.status = ${status}`);
    }
    // filter
    if (req.query.sort) {
      const sortQuery = req.query.sort;
      const sortArr = sortQuery.toString().split('-');
      builder.addOrderBy(
        `product.${sortArr[0]}`,
        sortArr[1] === 'ASC' ? 'ASC' : 'DESC',
      );
    }

    if (req.query.price) {
      const priceSort = req.query.price;
      const priceArr = priceSort.toString().split('-');
      const start = priceArr[0] ? priceArr[0] : 0;
      const end = priceArr[1] ? priceArr[1] : 100000000;
      builder.andWhere(`product.price BETWEEN ${start} AND ${end}`);
    }

    return builder.getOne();
    // return await this.restaurantService.getByID(id);
  }

  @Get(':id')
  async getByID(@Param('id') id: number): Promise<RestaurantEntity> {
    return await this.restaurantService.getByID(id);
  }

  @Post(':userID')
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
  async create(
    @Param('userID') userID: number,
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
      }),
    )
    image: Express.Multer.File,
    @Body() data: CreateRestaurantDTO,
  ): Promise<RestaurantEntity> {
    data.avatar = `http://${req.get('host')}/uploads/${image.filename}`;
    return await this.restaurantService.create(userID, data);
  }

  @Put(':user_id/:id')
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
  async update(
    @Param('user_id') user_id: number,
    @Param('id') id: number,
    @Req() req: Request,
    @UploadedFile()
    image: Express.Multer.File,
    @Body() data: UpdateRestaurantDTO,
  ): Promise<UpdateResult> {
    const currentData = await this.restaurantService.getByID(id);
    let fileName = currentData.avatar;
    if (image) {
      fileName = `http://${req.get('host')}/uploads/${image.filename}`;
    }
    data.avatar = fileName;
    return await this.restaurantService.update(user_id, id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return await this.restaurantService.delete(id);
  }
}
