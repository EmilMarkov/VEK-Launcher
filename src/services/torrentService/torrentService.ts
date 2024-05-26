import TorrentParserWorker from './torrent-parser.worker.js?worker';
import { gameService, IGame } from '@services/gameService/gameService';
import { toMagnetURI } from 'parse-torrent';
import { Semaphore } from 'async-mutex';  // Импортируем Semaphore из async-mutex

const MAX_WORKERS = 11;
const semaphore = new Semaphore(MAX_WORKERS);

class TorrentService {
  public async addTorrentByBuffer(buffer: Uint8Array, title: string): Promise<string> {
    const [value, release] = await semaphore.acquire();  // Корректно получаем семафор и функцию release
    return new Promise((resolve, reject) => {
      const worker = new TorrentParserWorker();

      worker.onmessage = ({ data }) => {
        if (data != "") {
          gameService.getGameByTitle(title)
              .then(game => {
                if (game) {
                  gameService.addTorrentToGame(game.id, data)
                      .then(resolve)
                      .catch(reject)
                      .finally(release);  // Освобождаем семафор после завершения
                } else {
                  resolve("");
                  release();  // Освобождаем семафор после завершения
                }
              })
              .catch(err => {
                reject(err);
                release();  // Освобождаем семафор после завершения
              });
        } else {
          console.error('Failed to parse torrent file', data.error);
          resolve("");
          release();  // Освобождаем семафор после завершения
        }
      };

      worker.onerror = (error) => {
        console.error('Worker error:', error);
        resolve("");
        release();  // Освобождаем семафор после завершения
      };

      worker.postMessage(buffer);
    });
  }

  private async addTorrentByLink(link: string, title: string): Promise<string> {
    try {
      const game: IGame | null = await gameService.getGameByTitle(title);

      if (game) {
        return await gameService.addTorrentToGame(game.id, link);
      }
    } catch (error) {
      console.error('Error adding torrent:', error);
    }
    return "";
  }
}

export default TorrentService;
