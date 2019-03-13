import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets';
import { QuotesService } from './services/quotes/quotes.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@WebSocketGateway({namespace: 'notif'})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() io;
    users = [];
    keys = {};

    constructor(
        private readonly _authService: QuotesService
    ) {}

    handleConnection(client) {
        client.emit('connection', 'Succesfully conected to server');
        console.log('New client connected ');
        

        if (client) {
            let jwt = (this.cookieParser(client.handshake.headers.cookie)['SESSIONID']);
            this._authService.authIO(jwt).then(data => {
                client.join(data.id);   
            }).catch(e => console.log('Client unauthorized'));
        }

        // client.on('newUser', (message) => {
        //     console.log("Message Received: " + message);
        //     // this.io.emit('newUser', { type: 'new-message', text: message });
        // });
    }

    handleDisconnect(client) {
        console.log('Client disconnected');
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
