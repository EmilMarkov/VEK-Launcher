import parseTorrent, { Instance as ParseTorrentInstance } from 'parse-torrent';
import WebTorrent, { Torrent, TorrentFile, TorrentOptions } from 'webtorrent';
import magnet from 'magnet-uri';
import fs from 'fs';
import { Worker } from 'worker_threads';

class TorrentService {
  private client: WebTorrent.Instance;

  constructor() {
    this.client = new WebTorrent();
  }

  public async handleTorrentFile(buffer: Buffer): Promise<string | undefined> {
    const worker = new Worker('./torrent-parser.worker.js');

    return new Promise((resolve, reject) => {
      worker.on('message', (result) => {
        if (result.success) {
          const torrentData = parseTorrent(result.data);
          const magnetLink = parseTorrent.toMagnetURI(torrentData);
          resolve(magnetLink);
        } else {
          console.error('Error handling torrent data:', result.error);
          reject(new Error(result.error));
        }
        worker.terminate();
      });

      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          console.error(`Worker stopped with exit code ${code}`);
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });

      worker.postMessage(buffer);
    });
  }

  public handleMagnetLink(magnetLink: string, downloadPath: string): Torrent | undefined {
    try {
      const parsedMagnetUri = magnet(magnetLink);
      return this.addTorrent(parsedMagnetUri, downloadPath);
    } catch (error) {
      console.error('Error handling magnet link:', error);
    }
  }

  private addTorrent(torrent: string | ParseTorrentInstance | magnet.Instance, downloadPath: string): Torrent | undefined {
    try {
      const options: TorrentOptions = {
        path: downloadPath
      };
      const addedTorrent = this.client.add(torrent as any, options);

      addedTorrent.on('done', () => {
        console.log(`Torrent ${addedTorrent.name} downloaded to ${downloadPath}`);
      });

      return addedTorrent;
    } catch (error) {
      console.error('Error adding torrent:', error);
    }
  }

  private readFile(filePath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err: NodeJS.ErrnoException | null, data: Buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  public getTorrentFiles(torrent: Torrent): TorrentFile[] {
    return torrent.files;
  }

  public destroyClient(): void {
    this.client.destroy(err => {
      if (err) {
        console.error('Error destroying client:', err);
      } else {
        console.log('WebTorrent client destroyed');
      }
    });
  }
}

export default TorrentService;
