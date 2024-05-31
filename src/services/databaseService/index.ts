import { invoke } from '@tauri-apps/api';
import {ITorrent} from "@/types";


export async function addTorrent(game: ITorrent): Promise<void> {
    invoke('add_torrent', { game });
}

export async function getTorrentById(id: string): Promise<ITorrent | null> {
    try {
        return await invoke<ITorrent>('get_torrent_by_id');
    } catch (error) {
        console.error("Failed to fetch torrents:", error);
        return null;
    }
}

export async function getAllTorrents(): Promise<ITorrent[]> {
    try {
        return await invoke<ITorrent[]>('get_all_torrents');
    } catch (error) {
        console.error("Failed to fetch torrents:", error);
        return [];
    }
}

export async function updateTorrent(game: ITorrent): Promise<void> {
    invoke('update_torrent', { game });
}

export async function deleteTorrent(id: string): Promise<void> {
    invoke('delete_torrent', { id: id });
}
