import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import "reflect-metadata"
import * as dotenv from 'dotenv';
import { Server , Socket } from 'socket.io';
dotenv.config();

@WebSocketGateway({ cors: { origin : process.env.WEBSOCKET_ORIGIN } })
export class GameGateway {

  @WebSocketServer()
  server : Server

  @SubscribeMessage('joinRoom')
  async handleMessage(client: Socket, payload: { roomName : string }) {
    const sockets = await this.server.in(payload.roomName).allSockets();
    const count = sockets.size;

    if (count < 2) {

      client.join(payload.roomName);

    } else {

      client.emit("Cannot join this room")

    }

  }

  @SubscribeMessage('newScore')
  handleNewScore(client : Socket , payload: { score : number , roomName : string }) : any {

    this.server.to(payload.roomName).emit("enemy_new_score" , { new_score : payload.score })

  }

}
