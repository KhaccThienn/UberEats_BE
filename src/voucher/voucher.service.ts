/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { VoucherEntity } from './entity/voucher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateVoucherDTO } from './dto/create-voucher.dto';
import { UpdateVoucherDTO } from './dto/update-voucher.dto';
import { RestaurantEntity } from 'src/restaurant/entity/restaurant.entity';
@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(VoucherEntity)
    private readonly voucherRepository: Repository<VoucherEntity>,

    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}

  async getAll(): Promise<VoucherEntity[]> {
    return await this.voucherRepository.find({
      relations: {
        orders: true,
        restaurant: true,
      },
    });
  }

  queryBuilder(query: string) {
    return this.voucherRepository.createQueryBuilder(query);
  }

  async getByID(id: number): Promise<VoucherEntity> {
    return await this.voucherRepository.findOne({
      relations: {
        orders: true,
        restaurant: true,
      },
      where: {
        id: id,
      },
    });
  }

  async create(voucher: CreateVoucherDTO): Promise<VoucherEntity> {
    console.log(voucher);

    const restaurant = await this.restaurantRepository.findOneBy({
      id: voucher.restaurantId,
    });
    const newVoucher = this.voucherRepository.create({
      ...voucher,
      restaurant,
    });
    console.log(newVoucher);

    return await this.voucherRepository.save(newVoucher);
  }

  async update(id: number, voucher: UpdateVoucherDTO): Promise<UpdateResult> {
    const restaurant = await this.restaurantRepository.findOneBy({
      id: voucher.restaurantId,
    });
    const newVoucher = this.voucherRepository.create({
      ...voucher,
      restaurant,
    });
    return await this.voucherRepository.update(id, newVoucher);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.voucherRepository.delete(id);
  }
}
