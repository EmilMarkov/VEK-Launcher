import { invoke } from '@tauri-apps/api';
import {IGame, IGameInput} from "@/types";

export async function addGame(game: IGameInput): Promise<void> {
    invoke('add_game', { game });
}

export async function getGameById(id: string): Promise<IGame | null> {
    try {
        return await invoke<IGame>('get_game_by_id');
    } catch (error) {
        console.error("Failed to fetch games:", error);
        return null;
    }
}

export async function getAllGames(): Promise<IGame[]> {
    try {
        return await invoke<IGame[]>('get_all_games');
    } catch (error) {
        console.error("Failed to fetch games:", error);
        return [];
    }
}


export async function updateGame(game: IGame): Promise<void> {
    invoke('update_game', { game });
}

export async function addTorrentToGame(id: string, torrent: string): Promise<void> {
    invoke('add_torrent', { id, torrent })
}

export async function deleteGame(id: string): Promise<void> {
    invoke('delete_game', {
        id: id
    });
}
