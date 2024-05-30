import {IGame} from '@/types';
import * as databaseService from '@services/databaseService';
import Fuse from 'fuse.js';
import { nanoid } from 'nanoid';
import {getGameById} from "@services/databaseService";

class GameService {
  private fuse: Fuse<IGame> | null = null;

  private async initializeFuse() {
    const games = await this.getAllGames();
    this.fuse = new Fuse(games, {
      keys: ['title'],
      threshold: 0.2
    });
  }

  async addGame(game: IGame): Promise<void> {
    const games = await this.getAllGames();
    if (games.some(g => g.name.toLowerCase() === game.name.toLowerCase())) {
      throw new Error('GameEntity title must be unique');
    }

    await databaseService.addGame(game);
    await this.initializeFuse();
  }

  async getGameById(id: string): Promise<IGame | null> {
    return await databaseService.getGameById(id);
  }

  async getAllGames(): Promise<IGame[]> {
    return await databaseService.getAllGames();
  }

  async getGameByTitle(title: string): Promise<IGame | null> {
    if (!this.fuse) {
      await this.initializeFuse();
    }

    const results = this.fuse?.search(title) ?? [];

    return results.length > 0 ? results[0].item : null;
  }

  async getGamesByTitle(title: string): Promise<IGame[]> {
    if (!this.fuse) {
      await this.initializeFuse();
    }

    const results = this.fuse?.search(title) ?? [];
    return results.map(result => result.item);
  }

  async addTorrentToGame(gameId: string, torrent: string): Promise<string> {
    await databaseService.addTorrentToGame(gameId, torrent);
    return torrent;
  }

  async updateGameById(game: IGame): Promise<void> {
    getGameById(game.id).then(async (result) => {
      if (result) {
        await databaseService.updateGame(game);
      }
    });
  }
}

export const gameService = new GameService();
