import { invoke } from '@tauri-apps/api/tauri';

class GameService {
    async getGameList(page?: number, next?: string): Promise<any> {
        try {
            return await invoke('get_game_list', { page, next });
        } catch (error) {
            console.error('Error fetching game list:', error);
            throw error;
        }
    }

    async searchGame(query: string, next?: string): Promise<any> {
        try {
            return await invoke('search_game', { query, next });
        } catch (error) {
            console.error('Error searching game:', error);
            throw error;
        }
    }

    async getGameDetail(id: number): Promise<any> {
        try {
            return await invoke('get_game_detail', { id });
        } catch (error) {
            console.error('Error fetching game detail:', error);
            throw error;
        }
    }

    async getGameScreenshots(id: number, page?: number, next?: string): Promise<any> {
        try {
            return await invoke('get_game_screenshots', { id, page, next });
        } catch (error) {
            console.error('Error fetching game screenshots:', error);
            throw error;
        }
    }

    async getGameMovies(id: number, next?: string): Promise<any> {
        try {
            return await invoke('get_game_movies', { id, next });
        } catch (error) {
            console.error('Error fetching game movies:', error);
            throw error;
        }
    }
}

export const gameService = new GameService();
