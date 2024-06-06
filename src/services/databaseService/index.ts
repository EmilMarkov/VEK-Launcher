import { invoke } from '@tauri-apps/api';
import {Torrent} from "@/types";


export async function addTorrent(game: Torrent): Promise<void> {
    invoke('add_torrent', { game });
}

export async function getTorrentById(id: string): Promise<Torrent | null> {
    try {
        return await invoke<Torrent>('get_torrent_by_id');
    } catch (error) {
        console.error("Failed to fetch torrents:", error);
        return null;
    }
}

export async function getAllTorrents(): Promise<Torrent[]> {
    try {
        return await invoke<Torrent[]>('get_all_torrents');
    } catch (error) {
        console.error("Failed to fetch torrents:", error);
        return [];
    }
}

export async function updateTorrent(game: Torrent): Promise<void> {
    invoke('update_torrent', { game });
}

export async function deleteTorrent(id: string): Promise<void> {
    invoke('delete_torrent', { id: id });
}
