export type ActionType = 'SET_LIFE' | 'ADD_LIFE' | 'ADD_POISON' | 'SET_CMD_DAMAGE' | 'MARK_DEAD';
export declare class GameActionDto {
    gameCode: string;
    type: ActionType;
    playerId: string;
    value?: number;
    fromPlayerId?: string;
}
