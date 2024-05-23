import { ITorrent } from "@/types/torrents";

export interface ITorrentProvider {
  getTorrents(existingTorrents?: ITorrent[], page?: Number): Promise<ITorrent[] | void>;
}
