import { Controller } from '@nestjs/common';
import { OrderDetailsService } from './order_details.service';

@Controller('order-details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}
}
