// src/game/game.gateway.ts
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import { JoinGameDto } from './dto/join-game.dto';
import { GameActionDto } from './dto/action.dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket) {
    // console.log('Client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected', client.id);
  }

  @SubscribeMessage('join_game')
  handleJoin(
    @MessageBody() data: JoinGameDto,
    @ConnectedSocket() client: Socket,
  ) {
    const game = this.gameService.addPlayer(data.gameCode, data.playerName);
    client.join(data.gameCode);

    this.server.to(data.gameCode).emit('game_state', game);
  }

  @SubscribeMessage('action')
  handleAction(@MessageBody() data: GameActionDto) {
    const game = this.gameService.applyAction(data);
    this.server.to(data.gameCode).emit('game_state', game);
  }
}
