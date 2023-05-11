import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateProductDTO } from './dto/create-product.dto';
import { RestaurantEntity } from 'src/restaurant/entity/restaurant.entity';
import { UpdateProductDTO } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        
        @InjectRepository(RestaurantEntity)
        private readonly restaurantRepository: Repository<RestaurantEntity>
    ){}
    
    async queryBuilder(query: string) {
        return await this.productRepository.createQueryBuilder(query);
    }

    async getAll(): Promise<ProductEntity[]>{
        return await this.productRepository.find();
    }

    async getByID(id:number): Promise<ProductEntity[]>{
        return await this.productRepository.findBy({id});
    }

    async create(id: number, product: CreateProductDTO): Promise<ProductEntity>{
        const restaurant = await this.restaurantRepository.findOneBy({id});

        const newProduct = this.productRepository.create({
            ...product,
            restaurant,
        });

        return this.productRepository.save(newProduct);
    }

    async update(restaurantId: number, id: number, product: UpdateProductDTO): Promise<UpdateResult>{
        const restaurant = await this.restaurantRepository.findOneBy({id:restaurantId});

        const newProduct = this.productRepository.create({
            ...product,
            restaurant,
        });

        return this.productRepository.update(id,newProduct);
    }

    async delete(id:number): Promise<DeleteResult>{
        return this.productRepository.delete(id);
    }
}
