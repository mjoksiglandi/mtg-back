import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { GameActionDto } from './dto/action.dto';
import { GameState } from './types/game-state';
export declare class GameService {
    private readonly prisma;
    private games;
    constructor(prisma: PrismaService);
    createGame(dto: CreateGameDto): Promise<GameState>;
    getGame(gameCode: string): GameState | undefined;
    addPlayer(gameCode: string, playerName: string): GameState;
    applyAction(action: GameActionDto): GameState;
    private checkWinConditions;
}
