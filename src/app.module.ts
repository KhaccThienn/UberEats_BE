/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entity/user.entity';
import { RestaurantModule } from './restaurant/restaurant.module';
import { ProductModule } from './product/product.module';
import { RestaurantEntity } from './restaurant/entity/restaurant.entity';
import { ProductEntity } from './product/entity/product.entity';
import { VoucherModule } from './voucher/voucher.module';
import { VoucherEntity } from './voucher/entity/voucher.entity';
import { OrderModule } from './order/order.module';
import { OrderEntity } from './order/entity/order.entity';
import { OrderDetailsModule } from './order_details/order_details.module';
import { OrderDeatailsEntity } from './order_details/entity/order_details.entity';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';
import { UpdateStatusModule } from './update-status/update-status.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'sota_project',
      entities: [
        User,
        RestaurantEntity,
        ProductEntity,
        VoucherEntity,
        OrderEntity,
        OrderDeatailsEntity,
      ],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    RestaurantModule,
    ProductModule,
    VoucherModule,
    OrderModule,
    OrderDetailsModule,
    CartModule,
    UpdateStatusModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
