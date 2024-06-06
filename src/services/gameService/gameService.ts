import { GameSearchResults } from '@/types';
import usePersistedState from '@/utils/userPersistedState';
import { invoke } from '@tauri-apps/api/tauri';

class GameService {
    async getGameList(api_key: string, page?: number, next?: string): Promise<any> {
        try {
            return await invoke('get_game_list', { apiKey: api_key, page, next });
        } catch (error) {
            console.error('Error fetching game list:', error);
            throw error;
        }
    }

    async searchGame(api_key: string, query: string, next?: string): Promise<GameSearchResults> {
        try {
            return await invoke('search_game', { apiKey: api_key, query, next });
        } catch (error) {
            console.error('Error searching game:', error);
            throw error;
        }
    }

    async getGameDetail(api_key: string, id: number): Promise<any> {
        try {
            return await invoke('get_game_details', { apiKey: api_key, id });
        } catch (error) {
            console.error('Error fetching game detail:', error);
            throw error;
        }
    }

    async getGameScreenshots(api_key: string, id: number, page?: number, next?: string): Promise<any> {
        try {
            return await invoke('get_game_screenshots', { apiKey: api_key, id, page, next });
        } catch (error) {
            console.error('Error fetching game screenshots:', error);
            throw error;
        }
    }

    async getGameMovies(api_key: string, id: number, next?: string): Promise<any> {
        try {
            return await invoke('get_game_movies', { apiKey: api_key, id, next });
        } catch (error) {
            console.error('Error fetching game movies:', error);
            throw error;
        }
    }
}

export const gameService = new GameService();
