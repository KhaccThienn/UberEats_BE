/* eslint-disable prettier/prettier */
import { diskStorage } from 'multer';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  Put,
  Delete,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductEntity } from './entity/product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateResult } from 'typeorm';
import { Request } from 'express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(@Req() req: Request): Promise<ProductEntity[]> {
    const builder = (
      await this.productService.queryBuilder('product')
    ).innerJoinAndSelect('product.restaurant', 'restaurant');

    // search
    if (req.query.keyWord) {
      builder.andWhere(`product.name LIKE '%${req.query.keyWord}%'`);
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

    // filter by restaurant
    if (req.query.restaurantID) {
      const cateID = +req.query.restaurantID;
      builder.andWhere('restaurant.id = :resID', { cateID });
    }

    // paginate
    if (req.query.page) {
      const page: number = parseInt(req.query.page as any) || 2;
      const perpage: number = parseInt(req.query.limit as any) || 2;

      builder.offset((page - 1) * perpage).limit(perpage);
    }

    // console.log(builder.getQuery());
    return await builder.getMany();
  }

  @Get(':id-:slugs')
  async getByID(
    @Param('id') id: number,
    @Param('slugs') slugs: string,
  ): Promise<ProductEntity> {
    console.log(slugs);

    return await this.productService.getByID(id);
  }

  @Post(':restaurantId')
  @UseInterceptors(
    FileInterceptor('image', {
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
    @Req() req: Request,
    @Param('restaurantId') restaurantId: number,
    @UploadedFile()
    image: Express.Multer.File,
    @Body() data: CreateProductDTO,
  ): Promise<ProductEntity> {
    data.image = `http://${req.get('host')}/uploads/${image.filename}`;
    return await this.productService.create(restaurantId, data);
  }

  @Put(':id/:restaurantId')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './src/public',
        filename(req, file, callback) {
          const dateNow = Date.now();
          const fileName = dateNow + file.originalname;
          callback(null, fileName);
        },
      }),
    }),
  )
  async update(
    @Req() req: Request,
    @Param('restaurantId') categoryId: number,
    @Param('id') id: number,
    @UploadedFile() image: Express.Multer.File,
    @Body() data: CreateProductDTO,
  ): Promise<UpdateResult> {
    const currentData = await this.productService.getByID(id);
    let fileName = currentData[0].image;
    if (image) {
      fileName = `http://${req.get('host')}/uploads/${image.filename}`;
    }
    data.image = fileName;
    return await this.productService.update(categoryId, id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.productService.delete(id);
  }
}
