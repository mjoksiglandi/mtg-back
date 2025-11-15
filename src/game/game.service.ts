// src/game/game.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { GameActionDto } from './dto/action.dto';
import { GameState, PlayerState } from './types/game-state';
import { randomUUID } from 'crypto';

function generateCode(length = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

@Injectable()
export class GameService {
  private games = new Map<string, GameState>(); // key: gameCode

  constructor(private readonly prisma: PrismaService) {}

  async createGame(dto: CreateGameDto): Promise<GameState> {
    const code = generateCode();
    const gameId = randomUUID();

    const state: GameState = {
      gameId,
      code,
      config: {
        format: dto.format,
        startingLifePlayer: dto.startingLifePlayer,
        startingLifeTeam: dto.startingLifeTeam,
        winConditions: {
          useCommanderDamage: dto.useCommanderDamage,
          commanderDamageLimit: dto.commanderDamageLimit,
          usePoison: dto.usePoison,
          poisonLimit: dto.poisonLimit,
        },
      },
      players: [],
      teams: [],
      commanderDamage: [],
      isFinished: false,
    };

    this.games.set(code, state);

    // Más adelante podrías persistir con Prisma:
    // await this.prisma.game.create({ data: { ... } });

    return state;
  }

  getGame(gameCode: string): GameState | undefined {
    return this.games.get(gameCode);
  }

  addPlayer(gameCode: string, playerName: string): GameState {
    const game = this.games.get(gameCode);
    if (!game) throw new Error('Game not found');

    const player: PlayerState = {
      id: randomUUID(),
      name: playerName,
      life: game.config.startingLifePlayer,
      poison: 0,
      isAlive: true,
      teamId: null,
    };

    game.players.push(player);
    return game;
  }

  applyAction(action: GameActionDto): GameState {
    const game = this.games.get(action.gameCode);
    if (!game) throw new Error('Game not found');

    const player = game.players.find((p) => p.id === action.playerId);
    if (!player) throw new Error('Player not found');

    switch (action.type) {
      case 'SET_LIFE':
        if (typeof action.value === 'number') player.life = action.value;
        break;
      case 'ADD_LIFE':
        if (typeof action.value === 'number') player.life += action.value;
        break;
      case 'ADD_POISON':
        if (typeof action.value === 'number') player.poison += action.value;
        break;
      case 'MARK_DEAD':
        player.isAlive = false;
        break;
      case 'SET_CMD_DAMAGE':
        if (!action.fromPlayerId || typeof action.value !== 'number') break;
        {
          const existing = game.commanderDamage.find(
            (e) =>
              e.fromPlayerId === action.fromPlayerId &&
              e.toPlayerId === action.playerId,
          );
          if (existing) {
            existing.damage = action.value;
          } else {
            game.commanderDamage.push({
              fromPlayerId: action.fromPlayerId,
              toPlayerId: action.playerId,
              damage: action.value,
            });
          }
        }
        break;
    }

    this.checkWinConditions(game);

    return game;
  }

  private checkWinConditions(game: GameState) {
    const { winConditions } = game.config;

    for (const player of game.players) {
      if (!player.isAlive) continue;

      if (player.life <= 0) {
        player.isAlive = false;
      }

      if (
        winConditions.usePoison &&
        player.poison >= winConditions.poisonLimit
      ) {
        player.isAlive = false;
      }

      if (winConditions.useCommanderDamage) {
        const totalCmdDamage = game.commanderDamage
          .filter((e) => e.toPlayerId === player.id)
          .reduce((sum, e) => sum + e.damage, 0);
        if (totalCmdDamage >= winConditions.commanderDamageLimit) {
          player.isAlive = false;
        }
      }
    }

    // De momento no calculamos ganador de equipo, solo marcamos vivos/muertos.
  }
}
