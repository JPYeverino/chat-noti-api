import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection {
  @WebSocketServer() wss;

  handleConnection(client) {
    console.log('New client connected');
    client.emit('connection', 'Successfully connected to server');
  }
}
