// src/game/game.module.ts
import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';

@Module({
  providers: [GameService, GameGateway],
  controllers: [GameController],
})
export class GameModule {}
