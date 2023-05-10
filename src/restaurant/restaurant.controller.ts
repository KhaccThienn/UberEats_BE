import { Body, Controller, Post } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDTO } from './dto/create-restaurant.dto';
import { RestaurantEntity } from './entity/restaurant.entity';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  async create(@Body() data: CreateRestaurantDTO): Promise<RestaurantEntity>{
    return await this.restaurantService.create(data);
  }
}
