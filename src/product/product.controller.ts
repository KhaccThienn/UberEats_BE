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
  Delete
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductEntity } from './entity/product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateResult } from 'typeorm';


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(): Promise<ProductEntity[]>{
    return await this.productService.getAll();
  }

  @Get(':id')
  async getByID(@Param('id') id: number): Promise<ProductEntity[]>{
    return await this.productService.getByID(id);
  }

  @Post(':id')
  @UseInterceptors(
    FileInterceptor('image',{
      storage: diskStorage({
        destination: './src/public',
        filename(req,file,callback){
          let filename = Date.now() + file.originalname;
          filename = filename.split(' ').join('_');   
          let fullpath = 'http://' + req.get('host') + '/public' + filename;
          callback(null,filename);
        },
      }),
    }),
  )

  async create(@Param('id') id: number,
  @UploadedFile(
    new ParseFilePipe({
      fileIsRequired: true,
    }),
  ) 
  image: Express.Multer.File,
  @Body() data:CreateProductDTO
  ): Promise<ProductEntity>{
    data.image = image.filename;
    return await this.productService.create(id,data);
  }

  @Put(':id/:restaurantId')
  @UseInterceptors(
    FileInterceptor('image',{
      storage: diskStorage({
        destination: './src/public',
        filename(req, file, callback) {
          const dateNow = Date.now();
          const fileName = dateNow + file.originalname;
          callback(null, fileName);
        },
      }),
    })
  )
  async update(
    @Param('restaurantId') categoryId:number, 
    @Param('id') id:number,
    @UploadedFile() image: Express.Multer.File,
    @Body() data:CreateProductDTO): Promise<UpdateResult>{
      const currentData = await this.productService.getByID(id);
      let fileName = currentData[0].image;
      if (image) {
        fileName = image.filename;
      }
      data.image = fileName;
    return await this.productService.update(categoryId,id,data);
  }

  @Delete(':id')
  async delete(@Param('id') id:number){
    return await this.productService.delete(id);
  }
}
