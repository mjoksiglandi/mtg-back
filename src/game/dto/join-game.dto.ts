// src/game/dto/join-game.dto.ts
import { IsString } from 'class-validator';

export class JoinGameDto {
  @IsString()
  gameCode: string;

  @IsString()
  playerName: string;
}
