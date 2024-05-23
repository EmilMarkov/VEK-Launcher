import { ITorrent } from '@/types/torrents';
import { BaseTorrentProvider } from '../BaseTorrentProvider';
import { JSDOM } from 'jsdom';
import TorrentService from '@/services/torrentService/torrentService';
import { getFileBuffer } from '../helpers';

let totalPages = 1;

export class ProviderXatab extends BaseTorrentProvider {
  torrentService = new TorrentService();

  async request(path: string): Promise<any> {
    return this.requestWebPage(`https://byxatab.com${path}`);
  }

  async getMagnet(url: string): Promise<{ magnet: string; } | null> {
    const data = await this.requestWebPage(url);
    const { window } = new JSDOM(data);
    const { document } = window;
  
    const $downloadButton = document.querySelector(".download-torrent") as HTMLAnchorElement;
  
    if (!$downloadButton) return null;
  
    const buffer = await getFileBuffer($downloadButton.href);
    const magnet = await this.torrentService.handleTorrentFile(buffer);
    if (magnet) {
      return { magnet };
    } else {
      return null;
    }
  };

  async getTorrents(existingTorrents: ITorrent[] = [], page = 1): Promise<ITorrent[] | void> {
    const torrents: ITorrent[] = []

    const data = await this.request('/page/${page}');
    const { window } = new JSDOM(data);

    if (page === 1) {
      totalPages = Number(
        window.document.querySelector(
          "#bottom-nav > div.pagination > a:nth-child(12)"
        )?.textContent
      );
    }

    const repacksFromPage = Array.from(
      window.document.querySelectorAll(".entry__title a")
    ).map(($a) => {
      return this.getMagnet(($a as HTMLAnchorElement).href)
        .then((magnet) => {
          if (magnet) {
            const title = $a.textContent!;
            const id: Number = GameService.getGameId(title);

            const torrent: ITorrent = {
              id: id,
              title: title,
              link: magnet.magnet
            }

            torrents.push(torrent);
          }
        })
    });

    await Promise.all(repacksFromPage);

    const newTorrents = torrents.filter(
      (torrent) => {
        if (Array.isArray(existingTorrents))
          {
            !existingTorrents.some(
              (existingTorrents) => existingTorrents.title === torrent.title
            )
          }
      }
    );

    if (!newTorrents.length) return;

    if (page === totalPages) return;

    return this.getTorrents(torrents, page + 1);
  }
}
