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
    const page: number = parseInt(req.query.page as any) || 1;
    const perpage: number = parseInt(req.query.limit as any) || 9;

    builder.offset((page - 1) * perpage).limit(perpage);

    // console.log(builder.getQuery());
    return builder.getMany();
  }

  @Get(':id')
  async getByID(@Param('id') id: number): Promise<ProductEntity[]> {
    return await this.productService.getByID(id);
  }

  @Post(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './src/public',
        filename(req, file, callback) {
          let filename = Date.now() + file.originalname;
          filename = filename.split(' ').join('_');
          callback(null, filename);
        },
      }),
    }),
  )
  async create(
    @Param('id') id: number,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
      }),
    )
    image: Express.Multer.File,
    @Body() data: CreateProductDTO,
  ): Promise<ProductEntity> {
    data.image = image.filename;
    return await this.productService.create(id, data);
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
    @Param('restaurantId') categoryId: number,
    @Param('id') id: number,
    @UploadedFile() image: Express.Multer.File,
    @Body() data: CreateProductDTO,
  ): Promise<UpdateResult> {
    const currentData = await this.productService.getByID(id);
    let fileName = currentData[0].image;
    if (image) {
      fileName = image.filename;
    }
    data.image = fileName;
    return await this.productService.update(categoryId, id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.productService.delete(id);
  }
}
