// src/game/game.controller.ts
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { GameService } from './game.service';
  import { CreateGameDto } from './dto/create-game.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async create(@Body() dto: CreateGameDto) {
    const game = await this.gameService.createGame(dto);
    return game;
  }

  @Get(':code')
  getByCode(@Param('code') code: string) {
    const game = this.gameService.getGame(code);
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }
}
