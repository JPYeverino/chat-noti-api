import { SubscribeMessage, WebSocketGateway, WebSocketServer, IoAdapter, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { HandleFunction } from 'connect';
import { QuotesService } from '../services/quotes/quotes.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@WebSocketGateway({namespace: 'notif'})
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() io;

  constructor(
    private readonly _authService: QuotesService
  ) { }

  handleConnection(client) {
    console.log('user connected to User Gateway');

    if(client.handshake.headers.cookie) {
      let jwt = (this.cookieParser(client.handshake.headers.cookie))['SESSIONID'];
      this._authService.authIO(jwt).then(data => {
        client.join(data.id);
      }).catch(e => console.log('unauthorized'));
    } else throw new HttpException('Socket Auth not working', HttpStatus.INTERNAL_SERVER_ERROR);

  }

  handleDisconnect(client) {
    console.log('Disconnected from Message')
  }

  private cookieParser(unparsedCookie) {
    let cookieObj = {};

    unparsedCookie.split(';').forEach(element => {
        let cookieKV = element.trim().split('=');

        cookieObj[cookieKV[0]] = cookieKV[1];

    });

    return cookieObj;
  }
}
