import localforage from 'localforage';
import { nanoid } from 'nanoid';
import Fuse from 'fuse.js';

export interface IGame {
  id: string;              // id игры
  title: string;           // Название игры
  description?: string;    // Описание игры
  screenshots?: string[];  // Ссылки на screenshots
  torrents?: string[];     // Magnet ссылки на торренты
}

localforage.config({
  name: 'gamesDatabase',
  storeName: 'games' // Имя хранилища в IndexedDB
});

class GameService {
  private fuse: Fuse<IGame> | null = null;

  // Инициализация Fuse.js с данными
  private async initializeFuse() {
    const games = await this.getAllGames();
    this.fuse = new Fuse(games, {
      keys: ['title'],
      threshold: 0.2 // Настройте threshold по необходимости
    });
  }

  // Добавление игры (id и title должны быть уникальными)
  async addGame(game: Omit<IGame, 'id'>): Promise<IGame> {
    const games = await this.getAllGames();
    if (games.some(g => g.title.toLowerCase() === game.title.toLowerCase())) {
      throw new Error('GameEntity title must be unique');
    }

    const newGame: IGame = { ...game, id: nanoid(), torrents: game.torrents ?? [], screenshots: game.screenshots ?? [] };
    await localforage.setItem(newGame.id, newGame);
    await this.initializeFuse();
    return newGame;
  }

  // Получение игры по id
  async getGameById(id: string): Promise<IGame | null> {
    return await localforage.getItem<IGame>(id);
  }

  // Получение всех игр
  async getAllGames(): Promise<IGame[]> {
    const games: IGame[] = [];
    await localforage.iterate((value: IGame) => {
      games.push(value);
    });
    return games;
  }

  // Получение игры по названию (наилучшее совпадение)
  async getGameByTitle(title: string): Promise<IGame | null> {
    if (!this.fuse) {
      await this.initializeFuse();
    }

    const results = this.fuse?.search(title) ?? [];

    if (results.length > 0)
    {
      console.log(results[0].item)
    }

    return results.length > 0 ? results[0].item : null;
  }

  // Получение списка игр по названию (наилучшее совпадение)
  async getGamesByTitle(title: string): Promise<IGame[]> {
    if (!this.fuse) {
      await this.initializeFuse();
    }

    const results = this.fuse?.search(title) ?? [];
    return results.map(result => result.item);
  }

  // Добавление нового торрента в список торрентов у игры по id
  async addTorrentToGame(gameId: string, torrent: string): Promise<string> {
    const game = await this.getGameById(gameId);
    if (!game) {
      throw new Error('GameEntity not found');
    }

    if (!game.torrents) {
      game.torrents = [];
    }

    if (!game.torrents.includes(torrent)) {
      game.torrents.push(torrent);
      await localforage.setItem(game.id, game);
      console.log(torrent)
      return torrent;
    }

    return '';
  }

  // Обновление данных у игры по id (кроме названия и id)
  async updateGameById(gameId: string, updateData: Partial<Omit<IGame, 'id' | 'title'>>): Promise<boolean> {
    const game = await this.getGameById(gameId);
    if (!game) {
      throw new Error('GameEntity not found');
    }

    const updatedGame = { ...game, ...updateData };
    const hasChanges = Object.keys(updateData).some(key => updateData[key as keyof Omit<IGame, 'id' | 'title'>] !== game[key as keyof Omit<IGame, 'id' | 'title'>]);

    if (!hasChanges) {
      return false;
    }

    await localforage.setItem(updatedGame.id, updatedGame);
    return true;
  }
}

export const gameService = new GameService();
