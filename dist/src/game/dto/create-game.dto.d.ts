export declare class CreateGameDto {
    format: 'COMMANDER' | 'TWO_HEADED_GIANT' | 'EMPEROR' | 'CUSTOM';
    startingLifePlayer: number;
    startingLifeTeam?: number;
    useCommanderDamage: boolean;
    commanderDamageLimit: number;
    usePoison: boolean;
    poisonLimit: number;
}
