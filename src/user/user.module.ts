/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { RestaurantService } from 'src/restaurant/restaurant.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => RestaurantModule),
  ],
  controllers: [UserController],
  providers: [UserService, RestaurantService],
  exports: [TypeOrmModule],
})
export class UserModule {}
