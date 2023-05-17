/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherEntity } from './entity/voucher.entity';
import { CreateVoucherDTO } from './dto/create-voucher.dto';
import { UpdateVoucherDTO } from './dto/update-voucher.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Get()
  async getAll(): Promise<VoucherEntity[]> {
    return await this.voucherService.getAll();
  }

  @Get(':id')
  async getByID(@Param('id') id: number): Promise<VoucherEntity[]> {
    return await this.voucherService.getByID(id);
  }

  @Post(':restaurantId')
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
