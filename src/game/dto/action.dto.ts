// src/game/dto/action.dto.ts
import { IsInt, IsOptional, IsString } from 'class-validator';

export type ActionType =
  | 'SET_LIFE'
  | 'ADD_LIFE'
  | 'ADD_POISON'
  | 'SET_CMD_DAMAGE'
  | 'MARK_DEAD';

export class GameActionDto {
  @IsString()
  gameCode: string;

  @IsString()
  type: ActionType;

  @IsString()
  playerId: string;

  @IsOptional()
  @IsInt()
  value?: number;

  @IsOptional()
  @IsString()
  fromPlayerId?: string;
}
