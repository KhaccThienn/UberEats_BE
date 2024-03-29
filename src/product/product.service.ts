/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { DeleteResult, Not, Repository, UpdateResult } from 'typeorm';
import { CreateProductDTO } from './dto/create-product.dto';
import { RestaurantEntity } from 'src/restaurant/entity/restaurant.entity';
import { UpdateProductDTO } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}

  queryBuilder(query: string) {
    return this.productRepository.createQueryBuilder(query);
  }

  async getAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find();
  }

  async getAllProdNames() {
    const prods = await this.productRepository.find();
    const products_names = [];
    prods.forEach((element) => {
      products_names.push(element.name);
    });
    return products_names;
  }

  async getAllRecordsExceptOne(id: number): Promise<ProductEntity[]> {
    const prods = await this.productRepository.find({
      where: { id: Not(id) },
    });
    const products_names = [];
    prods.forEach((element) => {
      products_names.push(element.name);
    });
    return products_names;
  }

  async getByID(id: number): Promise<ProductEntity> {
    return await this.productRepository.findOne({
      relations: {
        restaurant: true,
      },
      where: { id: id },
    });
  }

  async create(product: CreateProductDTO): Promise<ProductEntity> {
    const restaurant = await this.restaurantRepository.findOneBy({
      id: product.restaurantId,
    });

    const newProduct = this.productRepository.create({
      ...product,
      restaurant,
    });
    // console.log(newProduct);

    return this.productRepository.save(newProduct);
  }

  async update(id: number, product: UpdateProductDTO): Promise<UpdateResult> {
    const restaurant = await this.restaurantRepository.findOneBy({
      id: product.restaurantId,
    });

    const newProduct = this.productRepository.create({
      ...product,
      restaurant,
    });

    return this.productRepository.update(id, newProduct);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.productRepository.delete(id);
  }
}
