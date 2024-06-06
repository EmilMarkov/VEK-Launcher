import { TorrentInfo } from "@/types";
import { invoke } from "@tauri-apps/api";


class ProviderFitGirl{
  async fetchTorrentInfo(url: string): Promise<TorrentInfo> {
    try {
        const response = await invoke<TorrentInfo>('get_torrent_info_fitgirl', {
            url: url
        });
        return response;
    } catch (error) {
        console.error('Torrent get info error:', error);
        throw error;
    }
  }
}

export const providerFitGirl = new ProviderFitGirl();
