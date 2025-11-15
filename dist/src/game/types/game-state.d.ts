export type FormatType = 'COMMANDER' | 'TWO_HEADED_GIANT' | 'EMPEROR' | 'CUSTOM';
export interface PlayerState {
    id: string;
    name: string;
    teamId?: string | null;
    life: number;
    poison: number;
    isAlive: boolean;
}
export interface TeamState {
    id: string;
    name: string;
    life?: number;
    playerIds: string[];
}
export interface CommanderDamageEntry {
    fromPlayerId: string;
    toPlayerId: string;
    damage: number;
}
export interface WinConditionConfig {
    useCommanderDamage: boolean;
    commanderDamageLimit: number;
    usePoison: boolean;
    poisonLimit: number;
}
export interface GameConfig {
    format: FormatType;
    startingLifePlayer: number;
    startingLifeTeam?: number;
    winConditions: WinConditionConfig;
}
export interface GameState {
    gameId: string;
    code: string;
    config: GameConfig;
    players: PlayerState[];
    teams: TeamState[];
    commanderDamage: CommanderDamageEntry[];
    isFinished: boolean;
}
