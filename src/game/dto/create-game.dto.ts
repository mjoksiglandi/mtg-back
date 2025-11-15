// src/game/dto/create-game.dto.ts
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateGameDto {
  @IsString()
  format: 'COMMANDER' | 'TWO_HEADED_GIANT' | 'EMPEROR' | 'CUSTOM';

  @IsInt()
  @Min(1)
  startingLifePlayer: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  startingLifeTeam?: number;

  @IsBoolean()
  useCommanderDamage: boolean;

  @IsInt()
  @Min(1)
  commanderDamageLimit: number;

  @IsBoolean()
  usePoison: boolean;

  @IsInt()
  @Min(1)
  poisonLimit: number;
}
