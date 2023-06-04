import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayInit,
  OnGatewayConnection
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: "notification",
  cors: {
    origin: '*',
  },
})

export class SharedVideoGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    console.log('Socket init finished');
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    this.server.emit('message', 'hello this is message');
  }

  sendNotification(){
    this.server.emit('message', 'hello this is message 02');
  }
}