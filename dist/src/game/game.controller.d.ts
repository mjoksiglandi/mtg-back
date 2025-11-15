import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    create(dto: CreateGameDto): Promise<import("./types/game-state").GameState>;
    getByCode(code: string): import("./types/game-state").GameState;
}
