import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UpdateStatusService } from './update-status.service';
import { Server, Socket } from 'socket.io';
import { UpdateOrderDTO } from 'src/order/dto/update-order.dto';
import { CreateOrderDTO } from 'src/order/dto/create-order.dto';
import { Status } from 'src/model/status.enum';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UpdateStatusGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(private readonly updateStatusService: UpdateStatusService) {}
  private orderStatus = 'Pending';
  handleConnection(client: Socket) {
    // Gửi trạng thái đơn hàng hiện tại cho client khi kết nối
    client.emit('orderStatus', this.orderStatus);
  }

  handleDisconnect() {
    this.orderStatus = '';
  }

  @SubscribeMessage('createOrder')
  async create(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateOrderDTO,
  ) {
    console.log({ client, data });
    this.server.emit('createOrderClient', data);
    return data;
  }

  @SubscribeMessage('restaurantAcceptOrder')
  acceptOrder(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: UpdateOrderDTO,
  ) {
    console.log({ client, data });
    data.status === Status.COOKING
      ? this.server.emit('updateOrderStatusClient', data)
      : this.server.emit('updateOrderStatusDeliver', data);

    return data;
  }

  @SubscribeMessage('deliverAcceptOrder')
  completeOrder(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: UpdateOrderDTO,
  ) {
    console.log(client);

    this.server.emit('deliverUpdateOrderStatus', data);

    return data;
  }
}
