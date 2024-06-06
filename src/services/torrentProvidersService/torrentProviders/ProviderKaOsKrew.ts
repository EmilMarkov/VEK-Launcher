import { TorrentInfo } from "@/types";
import { invoke } from "@tauri-apps/api";


class ProviderKaOsKrew{
  async fetchTorrentInfo(url: string): Promise<TorrentInfo> {
    try {
        const response = await invoke<TorrentInfo>('get_torrent_info_kaoskrew', {
            url: url
        });
        return response;
    } catch (error) {
        console.error('Torrent get info error:', error);
        throw error;
    }
  }
}

export const providerKaOsKrew = new ProviderKaOsKrew();
