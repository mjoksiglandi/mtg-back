import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import { JoinGameDto } from './dto/join-game.dto';
import { GameActionDto } from './dto/action.dto';
export declare class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly gameService;
    server: Server;
    constructor(gameService: GameService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoin(data: JoinGameDto, client: Socket): void;
    handleAction(data: GameActionDto): void;
}
