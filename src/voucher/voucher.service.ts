/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { VoucherEntity } from './entity/voucher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Not, Repository, UpdateResult } from 'typeorm';
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
  async getByRestaurantID(resId: number): Promise<VoucherEntity[]> {
    const restaurantFounded = await this.restaurantRepository.findOne({
      where: {
        id: resId,
      },
    });
    return await this.voucherRepository.find({
      relations: {
        orders: true,
        restaurant: true,
      },
      where: {
        restaurant: restaurantFounded,
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
  async getAllVouchersName() {
    const vouchers = await this.voucherRepository.find();
    const vouchers_names = [];
    vouchers.forEach((element) => {
      vouchers_names.push(element.name);
    });
    return vouchers_names;
  }

  async getAllRecordsExceptOne(id: number): Promise<VoucherEntity[]> {
    const vouchers = await this.voucherRepository.find({
      where: { id: Not(id) },
    });
    const vouchers_names = [];
    vouchers.forEach((element) => {
      vouchers_names.push(element.name);
    });
    return vouchers_names;
  }

  async getVoucherByName(voucherName: string): Promise<VoucherEntity> {
    return await this.voucherRepository.findOne({
      relations: {
        orders: true,
        restaurant: true,
      },
      where: {
        name: voucherName,
      },
    });
  }

  async getAllVouchersName() {
    const vouchers = await this.voucherRepository.find({
      select: ['name'],
    });
    console.log(vouchers);

    const vouchers_names = [];
    vouchers.forEach((element) => {
      vouchers_names.push(element.name);
    });
    return vouchers_names;
  }

  async getAllRecordsExceptOne(id: number): Promise<VoucherEntity[]> {
    const vouchers = await this.voucherRepository.find({
      where: { id: Not(id) },
    });
    const vouchers_names = [];
    vouchers.forEach((element) => {
      vouchers_names.push(element.name);
    });
    return vouchers_names;
  }

  async create(voucher: CreateVoucherDTO): Promise<VoucherEntity> {
    const restaurant = await this.restaurantRepository.findOneBy({
      id: voucher.restaurantId,
    });
    if (voucher.discount < 0 || voucher.discount > 100) {
    }
    const newVoucher = this.voucherRepository.create({
      ...voucher,
      restaurant,
    });
    console.log(newVoucher);

    return await this.voucherRepository.save(newVoucher);
  }

  async update(id: number, voucher: UpdateVoucherDTO): Promise<UpdateResult> {
    console.log(voucher);

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
