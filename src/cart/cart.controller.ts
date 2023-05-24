import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDTO } from './dtos/create-cart.dto';
import { UpdateCartDTO } from './dtos/update-cart.dto';
import { UpdateResult } from 'typeorm';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  async getCartItemsByUser(@Param('userId') userId: number) {
    return await this.cartService.getAllCartByUser(userId);
  }

  @Post()
  async saveDataToCart(@Body() saveToCart: CreateCartDTO) {
    return await this.cartService.saveToCart(saveToCart);
  }

  @Put()
  async updateDataToCart(
    @Body() updateDataToCart: UpdateCartDTO,
  ): Promise<UpdateResult> {
    return await this.cartService.changeQuantity(updateDataToCart);
  }

  @Delete(':cartId')
  async deleteDataFromCart(@Param('cartId') cartId: string) {
    return await this.cartService.removeFromCart(cartId);
  }
}
