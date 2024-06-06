import { TorrentInfo } from "@/types";
import { invoke } from "@tauri-apps/api";


class ProviderTinyRepacks {
  async fetchTorrentInfo(url: string): Promise<TorrentInfo> {
    try {
        const response = await invoke<TorrentInfo>('get_torrent_info_tinyrepacks', {
            url: url
        });
        return response;
    } catch (error) {
        console.error('Torrent get info error:', error);
        throw error;
    }
  }
}

export const providerTinyRepacks = new ProviderTinyRepacks();
