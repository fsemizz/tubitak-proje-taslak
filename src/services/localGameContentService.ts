import type { IGameContentService } from './types';
import type { GameDefinition, GameLevel } from '@/types/game';
import { gameList, gameRegistry } from '@/games/registry';

export class LocalGameContentService implements IGameContentService {
  async listGames(): Promise<GameDefinition[]> {
    return gameList;
  }

  async getGame(gameId: string): Promise<GameDefinition | null> {
    return gameRegistry[gameId]?.definition ?? null;
  }

  async listLevels(gameId: string): Promise<GameLevel[]> {
    return gameRegistry[gameId]?.levels ?? [];
  }

  async getLevel(gameId: string, levelId: string): Promise<GameLevel | null> {
    const levels = gameRegistry[gameId]?.levels ?? [];
    return levels.find((l) => l.id === levelId) ?? null;
  }
}
