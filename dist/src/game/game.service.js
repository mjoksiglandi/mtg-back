"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_1 = require("crypto");
function generateCode(length = 6) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}
let GameService = class GameService {
    prisma;
    games = new Map();
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createGame(dto) {
        const code = generateCode();
        const gameId = (0, crypto_1.randomUUID)();
        const state = {
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
        return state;
    }
    getGame(gameCode) {
        return this.games.get(gameCode);
    }
    addPlayer(gameCode, playerName) {
        const game = this.games.get(gameCode);
        if (!game)
            throw new Error('Game not found');
        const player = {
            id: (0, crypto_1.randomUUID)(),
            name: playerName,
            life: game.config.startingLifePlayer,
            poison: 0,
            isAlive: true,
            teamId: null,
        };
        game.players.push(player);
        return game;
    }
    applyAction(action) {
        const game = this.games.get(action.gameCode);
        if (!game)
            throw new Error('Game not found');
        const player = game.players.find((p) => p.id === action.playerId);
        if (!player)
            throw new Error('Player not found');
        switch (action.type) {
            case 'SET_LIFE':
                if (typeof action.value === 'number')
                    player.life = action.value;
                break;
            case 'ADD_LIFE':
                if (typeof action.value === 'number')
                    player.life += action.value;
                break;
            case 'ADD_POISON':
                if (typeof action.value === 'number')
                    player.poison += action.value;
                break;
            case 'MARK_DEAD':
                player.isAlive = false;
                break;
            case 'SET_CMD_DAMAGE':
                if (!action.fromPlayerId || typeof action.value !== 'number')
                    break;
                {
                    const existing = game.commanderDamage.find((e) => e.fromPlayerId === action.fromPlayerId &&
                        e.toPlayerId === action.playerId);
                    if (existing) {
                        existing.damage = action.value;
                    }
                    else {
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
    checkWinConditions(game) {
        const { winConditions } = game.config;
        for (const player of game.players) {
            if (!player.isAlive)
                continue;
            if (player.life <= 0) {
                player.isAlive = false;
            }
            if (winConditions.usePoison &&
                player.poison >= winConditions.poisonLimit) {
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
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GameService);
//# sourceMappingURL=game.service.js.map