/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherEntity } from './entity/voucher.entity';
import { CreateVoucherDTO } from './dto/create-voucher.dto';
import { UpdateVoucherDTO } from './dto/update-voucher.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Voucher API')
@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Get()
  async getAll(@Req() req: Request): Promise<VoucherEntity[]> {
    // return await this.voucherService.getAll();
    const builder = (await this.voucherService.queryBuilder('voucher'))
      .innerJoinAndSelect('voucher.restaurant', 'restaurant')
      .leftJoinAndSelect('voucher.orders', 'orders')
      .leftJoinAndSelect('restaurant.user', 'user');

    // search
    if (req.query.keyWord) {
      builder.andWhere(`voucher.name LIKE '%${req.query.keyWord}%'`);
    }

    // filter
    if (req.query.sort) {
      const sortQuery = req.query.sort;
      const sortArr = sortQuery.toString().split('-');
      builder.orderBy(
        `voucher.${sortArr[0]}`,
        sortArr[1] == 'ASC' ? 'ASC' : 'DESC',
      );
    }

    if (req.query.userId) {
      const cateID = +req.query.userId;
      builder.andWhere(`user.id = ${cateID}`);
    }

    // filter by restaurant
    if (req.query.restaurantID) {
      const cateID = +req.query.restaurantID;
      builder.andWhere('restaurant.id = :resID', { cateID });
    }

    // paginate
    if (req.query.page || req.query.limit) {
      const page: number = parseInt(req.query.page as any) || 1;
      const perpage: number = parseInt(req.query.limit as any) || 2;

      builder.offset((page - 1) * perpage).limit(perpage);
    }

    // console.log(await builder.getMany());
    return await builder.getMany();
  }

  @Get(':id')
  async getByID(@Param('id') id: number): Promise<VoucherEntity> {
    return await this.voucherService.getByID(id);
  }
  @Get(':voucherName')
  async getByVoucherName(
    @Param('voucherName') voucherName: string,
  ): Promise<VoucherEntity> {
    return await this.voucherService.getVoucherByName(voucherName);
  }

  @Get('vouchers')
  async getAllVoucherNamee() {
    return this.voucherService.getAllVouchersName();
  }

  @Get('/vouchers/:id')
  async getAllRecordsExceptOne(@Param('id') id: number) {
    return this.voucherService.getAllRecordsExceptOne(id);
  }

  @Get('/restaurant/:resId')
  async getByResId(@Param('resId') resId: number) {
    return await this.voucherService.getByRestaurantID(resId);
  }

  @Post()
  async create(@Body() data: CreateVoucherDTO): Promise<VoucherEntity> {
    return await this.voucherService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: UpdateVoucherDTO,
  ): Promise<UpdateResult> {
    return await this.voucherService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return await this.voucherService.delete(id);
  }
}
