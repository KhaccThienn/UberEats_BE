/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entity/cart.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateCartDTO } from './dtos/create-cart.dto';
import { User } from 'src/user/entity/user.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { UpdateCartDTO } from './dtos/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async getAllCartByUser(userId: number) {
    const userFound = await this.userRepository.findOne({
      relations: {
        carts: true,
        restaurant: true,
      },
      where: {
        id: userId,
      },
    });

    const carts = await this.cartRepository.find({
      relations: {
        product: {
          restaurant: true,
        },
        user: true,
      },
      where: {
        user: userFound,
      },
    });
    const result = await this.cartRepository
      .createQueryBuilder('cart')
      .select('SUM(cart.total)', 'total')
      .getRawOne();

    return {
      carts,
      result,
    };
  }

  async saveToCart(addToCartDTO: CreateCartDTO) {
    const userFound = await this.userRepository.findOne({
      where: {
        id: addToCartDTO.userId,
      },
    });

    const productFound = await this.productRepository.findOne({
      where: {
        id: addToCartDTO.productId,
      },
    });

    const cartFound = await this.cartRepository.findOne({
      where: {
        product: productFound,
      },
    });

    if (cartFound) {
      return this.cartRepository.update(cartFound, {
        quantity: cartFound.quantity + 1,
      });
    }

    const newCart = await this.cartRepository.create({
      ...addToCartDTO,
      user: userFound,
      product: productFound,
      total:
        productFound.sale_price > 0
          ? productFound.sale_price * addToCartDTO.quantity
          : productFound.price * addToCartDTO.quantity,
    });

    return await this.cartRepository.save(newCart);
  }

  async changeQuantity(updateCartDTO: UpdateCartDTO): Promise<UpdateResult> {
    console.log('Service: ', updateCartDTO);

    const userFound = await this.userRepository.findOne({
      where: {
        id: updateCartDTO.userId,
      },
    });

    const productFound = await this.productRepository.findOne({
      where: {
        id: updateCartDTO.prodId,
      },
    });
    console.log(productFound);

    const cartFound = await this.cartRepository.findOne({
      where: {
        product: productFound,
        user: userFound,
      },
    });
    console.log(cartFound);

    const newData = {
      quantity: updateCartDTO.quantity,
      total:
        productFound.sale_price > 0
          ? productFound.sale_price * updateCartDTO.quantity
          : productFound.price * updateCartDTO.quantity,
    };
    console.log('New Cart Data', newData);

    const newCart = await this.cartRepository.update(cartFound, {
      quantity: newData.quantity,
      total: newData.total,
    });

    console.log(newCart);
    return newCart;
  }

  async removeFromCart(cartId: string) {
    return this.cartRepository.delete(cartId);
  }

  async removeAllCartByUser(userId: string) {
    const userFound = await this.userRepository.findOne({
      where: {
        id: +userId,
      },
    });

    return await this.cartRepository.delete({
      user: userFound,
    });
  }
}
