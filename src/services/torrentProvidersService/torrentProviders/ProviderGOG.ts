import { ITorrent } from '@/types/torrents';
import { BaseTorrentProvider } from '../BaseTorrentProvider';
import { JSDOM, VirtualConsole } from 'jsdom';

const virtualConsole = new VirtualConsole();

export class ProviderGOG extends BaseTorrentProvider {
  async request(path: string): Promise<any> {
    return this.requestWebPage(`https://freegogpcgames.com${path}`);
  }

  async getTorrents(): Promise<ITorrent[]> {
    const torrents: ITorrent[] = [];
    const data = await this.request('/a-z-games-list/');
    const { window } = new JSDOM(data, { virtualConsole });
    const $uls = Array.from(window.document.querySelectorAll(".az-columns"));

    for (const $ul of $uls) {
      const $lis = Array.from($ul.querySelectorAll("li"));

      for (const $li of $lis) {
        const $a = $li.querySelector("a")!;
        const title = $a.innerText;
        const href = $a.href;

        const torrentExists = true;

        if (!torrentExists) {
          const id: Number = GameService.getGameId(title);
          const magnetUrl = await this.getMagnet(href);

          if (id && magnetUrl) {
            const torrent: ITorrent = {
              id: id,
              title: title,
              link: magnetUrl
            }
  
            torrents.push(torrent);
          }
        }
      }
    }

    return torrents;
  }

  getUploadDate(document: Document) {
    const $modifiedTime = document.querySelector(
      '[property="article:modified_time"]'
    ) as HTMLMetaElement;
    if ($modifiedTime) return $modifiedTime.content;
  
    const $publishedTime = document.querySelector(
      '[property="article:published_time"]'
    ) as HTMLMetaElement;
    return $publishedTime.content;
  };

  getDownloadLink(document: Document) {
    const $latestDownloadButton = document.querySelector(
      ".download-btn:not(.lightweight-accordion *)"
    ) as HTMLAnchorElement;
    if ($latestDownloadButton) return $latestDownloadButton.href;
  
    const $downloadButton = document.querySelector(
      ".download-btn"
    ) as HTMLAnchorElement;
    if (!$downloadButton) return null;
  
    return $downloadButton.href;
  };

  async getMagnet(url: string) {
    const data = await this.requestWebPage(url);
    const { window } = new JSDOM(data, { virtualConsole });
  
    const downloadLink = this.getDownloadLink(window.document);
    if (!downloadLink) return null;

    if (downloadLink.startsWith("http")) {
      const { searchParams } = new URL(downloadLink);
      return Buffer.from(searchParams.get("url")!, "base64").toString("utf-8");
    }
  
    return downloadLink;
  };
}
