/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDeatailsEntity } from 'src/order_details/entity/order_details.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { RestaurantEntity } from 'src/restaurant/entity/restaurant.entity';
import { User } from 'src/user/entity/user.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateOrderDTO } from './dto/create-order.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { OrderEntity } from './entity/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(VoucherEntity)
    private readonly voucherRepository: Repository<VoucherEntity>,

    @InjectRepository(OrderDeatailsEntity)
    private readonly orderDeatailsRepository: Repository<OrderDeatailsEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}

  queryBuilder(query: string) {
    return this.orderRepository.createQueryBuilder(query);
  }

  async getAll(): Promise<OrderEntity[]> {
    return await this.orderRepository.find({
      relations: {
        user: true,
        vouchers: true,
      },
    });
  }

  async getByID(id: number): Promise<OrderEntity> {
    return await this.orderRepository.findOne({
      relations: {
        user: true,
        vouchers: true,
        restaurant: true,
        order_details: true,
      },
      where: {
        id: id,
      },
    });
  }

  async getOrdersByUserId(userId: number) {
    const userFound = await this.userRepository.findOne({
      where: [
        {
          id: userId,
        },
      ],
    });

    return await this.orderRepository.find({
      relations: {
        user: true,
        driver: true,
        vouchers: true,
      },
      where: [
        {
          user: userFound,
        },
      ],
    });
  }

  async create(order: CreateOrderDTO) {
    console.log('Order Data', order);
    const userFound = await this.userRepository.findOne({
      where: [{ id: order.userId }],
    });

    const vouchersFound = await this.voucherRepository.findOne({
      where: [
        {
          id: order.vouchersId,
        },
      ],
    });

    const restaurantFound = await this.restaurantRepository.findOne({
      where: [
        {
          id: order.restaurantId,
        },
      ],
    });

    const orders = new OrderEntity();
    orders.delivered_address = order.delivered_address;
    orders.delivered_phone = order.delivered_phone;
    orders.delivered_user = order.delivered_user;
    orders.created_at = order.created_at;
    orders.note = order.note;
    orders.status = order.status;
    orders.total_price = order.total_price;
    orders.user = userFound;
    orders.vouchers = vouchersFound;
    orders.restaurant = restaurantFound;

    // Save the order entity
    const savedOrder = await this.orderRepository.save(orders);

    // Create and save the order details entities
    const orderDetails = order.carts.map((cart) => {
      console.log(cart);

      const orderDetail = new OrderDeatailsEntity();
      orderDetail.total = +cart.total;
      orderDetail.quantity = cart.quantity;
      orderDetail.product = cart.product;
      orderDetail.orders = savedOrder;
      return orderDetail;
    });

    await this.orderDeatailsRepository.save(orderDetails);

    return savedOrder;
  }

  async updateStatus(id: number, order: UpdateOrderDTO) {
    console.log(order);

    return await this.orderRepository.update(id, order);
  }
  async updateDeliver(id: number, deliverId: number, order: UpdateOrderDTO) {
    const deliveryFound = await this.userRepository.findOne({
      where: [
        {
          id: deliverId,
        },
      ],
    });

    const updatedOrder = await this.orderRepository.create({
      ...order,
      driver: deliveryFound,
    });

    return await this.orderRepository.update(id, updatedOrder);
  }

  async delete(id: number) {
    const orderFound = await this.orderRepository.findOne({
      relations: {
        order_details: true,
      },
      where: [
        {
          id: id,
        },
      ],
    });
    console.log(orderFound.order_details);
    orderFound.order_details.map(async (e, i) => {
      await this.orderDeatailsRepository.delete(e.id);
    });
    return await this.orderRepository.delete(id);
  }
}
