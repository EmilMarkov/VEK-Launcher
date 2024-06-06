import { TorrentInfo } from "@/types";
import { invoke } from "@tauri-apps/api";


class Provider0xEMPRESS{
  async fetchTorrentInfo(url: string): Promise<TorrentInfo> {
    try {
        const response = await invoke<TorrentInfo>('get_torrent_info_0xempress', {
            url: url
        });
        return response;
    } catch (error) {
        console.error('Torrent get info error:', error);
        throw error;
    }
  }
}

export const provider0xEMPRESS = new Provider0xEMPRESS();
