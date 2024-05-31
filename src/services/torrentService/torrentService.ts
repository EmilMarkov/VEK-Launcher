import TorrentParserWorker from './torrent-parser.worker.js?worker';
import {ITorrent} from "@/types";
import { Semaphore } from 'async-mutex';
import Fuse from "fuse.js";
import * as databaseService from "@services/databaseService";

const MAX_WORKERS = 11;
const semaphore = new Semaphore(MAX_WORKERS);

class TorrentService {
  private fuse: Fuse<ITorrent> | null = null;

  private async initializeFuse() {
    const torrents = await this.getAllTorrents();
    this.fuse = new Fuse(torrents, {
      keys: ['name'],
      threshold: 0.2
    });
  }

  private async addTorrent(torrent: ITorrent): Promise<void> {
    await databaseService.addTorrent(torrent);
    await this.initializeFuse();
  }

  public async addTorrentByBuffer(buffer: Uint8Array, name: string, repacker: string, updated: string): Promise<void> {
    const [value, release] = await semaphore.acquire();
    return new Promise((resolve, reject) => {
      const worker = new TorrentParserWorker();

      worker.onmessage = ({ data }) => {
        if (data != "") {
          const torrent: ITorrent = {
            id: "",
            name: name,
            repacker: repacker,
            updated: updated,
            torrent: data
          }

          this.addTorrent(torrent)
              .then(resolve)
              .catch(reject)
              .finally(release);
        } else {
          console.error('Failed to parse torrent file', data.error);
          release();
        }
      };

      worker.onerror = (error) => {
        console.error('Worker error:', error);
        release();
      };

      worker.postMessage(buffer);
    });
  }

  public async addTorrentByLink(name: string, repacker: string, updated: string, link: string): Promise<void> {
    try {
      const torrent: ITorrent = {
        id: "",
        name: name,
        repacker: repacker,
        updated: updated,
        torrent: link
      }

      await this.addTorrent(torrent);
    } catch (error) {
      console.error('Error adding torrent:', error);
    }
  }

  public async getTorrentById(id: string): Promise<ITorrent | null> {
    return await databaseService.getTorrentById(id);
  }

  public async getAllTorrents(): Promise<ITorrent[]> {
    return await databaseService.getAllTorrents();
  }

  public async getTorrentsByName(name: string): Promise<ITorrent[]> {
    if (!this.fuse) {
      await this.initializeFuse();
    }

    const results = this.fuse?.search(name) ?? [];
    return results.map(result => result.item);
  }

  public async updateTorrentById(torrent: ITorrent): Promise<void> {
    await databaseService.updateTorrent(torrent);
    await this.initializeFuse();
  }
}

export default TorrentService;
