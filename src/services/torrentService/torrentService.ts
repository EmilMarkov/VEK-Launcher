import {Torrent} from "@/types";
import Fuse from "fuse.js";
import * as databaseService from "@services/databaseService";

class TorrentService {
  private fuse: Fuse<Torrent> | null = null;

  private async initializeFuse() {
    const torrents = await this.getAllTorrents();
    this.fuse = new Fuse(torrents, {
      keys: ['name'],
      threshold: 0.2
    });
  }

  private async addTorrent(torrent: Torrent): Promise<void> {
    await databaseService.addTorrent(torrent);
    await this.initializeFuse();
  }

  public async getTorrentById(id: string): Promise<Torrent | null> {
    return await databaseService.getTorrentById(id);
  }

  public async getAllTorrents(): Promise<Torrent[]> {
    return await databaseService.getAllTorrents();
  }

  public async getTorrentsByName(name: string): Promise<Torrent[]> {
    if (!this.fuse) {
      await this.initializeFuse();
    }

    const results = this.fuse?.search(name) ?? [];
    return results.map(result => result.item);
  }

  public async updateTorrentById(torrent: Torrent): Promise<void> {
    await databaseService.updateTorrent(torrent);
    await this.initializeFuse();
  }
}

export const torrentService = new TorrentService();
