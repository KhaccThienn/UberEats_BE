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
import { unlinkSync } from 'fs';
import { UpdateProductDTO } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Product API')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(@Req() req: Request): Promise<ProductEntity[]> {
    const builder = (await this.productService.queryBuilder('product'))
      .innerJoinAndSelect('product.restaurant', 'restaurant')
      .leftJoinAndSelect('restaurant.user', 'user');

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
      builder.andWhere(`restaurant.id = ${cateID}`);
    }

    if (req.query.userId) {
      const cateID = +req.query.userId;
      builder.andWhere(`user.id = ${cateID}`);
    }

    // paginate
    if (req.query.page || req.query.limit) {
      const page: number = parseInt(req.query.page as any) || 1;
      const perpage: number = parseInt(req.query.limit as any) || 2;

      builder.offset((page - 1) * perpage).limit(perpage);
    }
    return await builder.getMany();
  }

  @Get('/names')
  async getAllProductsName() {
    return await this.productService.getAllProdNames();
  }

  @Get('/prods/:id')
  async getAllRecordsExceptOne(@Param('id') id: number) {
    return this.productService.getAllRecordsExceptOne(id);
  }

  @Get(':id-:slugs')
  async getByID(
    @Param('id') id: number,
    @Param('slugs') slugs: string,
  ): Promise<ProductEntity> {
    return await this.productService.getByID(id);
  }

  @Post()
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
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
      }),
    )
    image: Express.Multer.File,
    @Body() data: CreateProductDTO,
  ): Promise<ProductEntity> {
    data.image = `http://${req.get('host')}/uploads/${image.filename}`;
    return await this.productService.create(data);
  }

  @Put(':id')
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
  async update(
    @Req() req: Request,
    @Param('id') id: number,
    @UploadedFile() image: Express.Multer.File,
    @Body() data: UpdateProductDTO,
  ): Promise<UpdateResult> {
    const currentData = await this.productService.getByID(id);
    let fileName = currentData.image;
    if (image) {
      const filePath = currentData.image.replace(
        `http://${req.get('host')}/uploads/`,
        '',
      );
      unlinkSync('./src/public/uploads/' + filePath);
      fileName = `http://${req.get('host')}/uploads/${image.filename}`;
    }
    // console.log(currentData);
    data.image = fileName;
    return await this.productService.update(id, data);
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: number) {
    const currentData = await this.productService.getByID(id);
    // console.log(currentData);

    const filePath = currentData.image.replace(
      `http://${req.get('host')}/uploads/`,
      '',
    );
    console.log(filePath);
    unlinkSync('./src/public/uploads/' + filePath);
    return await this.productService.delete(id);
  }
}
