import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Post, 
  Put,
  Req
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDTO } from './dto/create-restaurant.dto';
import { RestaurantEntity } from './entity/restaurant.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateRestaurantDTO } from './dto/update-restaurant.dto';
import { Request } from 'express';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  async getAll(@Req() req:Request): Promise<RestaurantEntity[]>{
    const builder = (
      await this.restaurantService.queryBuilder('restaurant')
    );

    // search
    if ( req.query.keyWord){
      builder.andWhere(`restaurant.name LIKE '%${req.query.keyWord}%'`);
    }

    //paginate
    const page: number = parseInt(req.query.page as any) || 1;
    const perpage: number = parseInt(req.query.limit as any) || 9;

    builder.offset((page - 1) * perpage).limit(perpage);

    return builder.getMany();
  }

  @Get(':id')
  async getByID(@Param('id') id: number): Promise<RestaurantEntity[]>{
    return await this.restaurantService.getByID(id);
  }

  @Post()
  async create(@Body() data: CreateRestaurantDTO): Promise<RestaurantEntity>{
    return await this.restaurantService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id:number, @Body() data:UpdateRestaurantDTO): Promise<UpdateResult>{
    return await this.restaurantService.update(id,data);
  }

  @Delete(':id')
  async delete(@Param('id') id:number): Promise<DeleteResult>{
    return await this.restaurantService.delete(id);
  }
}
