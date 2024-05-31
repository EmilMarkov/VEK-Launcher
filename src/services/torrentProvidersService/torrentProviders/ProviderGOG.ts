import { JSDOM, VirtualConsole } from 'jsdom';
import { requestWebPage } from '../helpers';

const virtualConsole = new VirtualConsole();

export class ProviderGOG {
  async request(path: string): Promise<any> {
    return requestWebPage(`https://freegogpcgames.com${path}`);
  }

  async getTorrents(): Promise<string[]> {
    const torrents: string[] = [];
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


      }
    }

    return torrents;
  }

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
    const data = await requestWebPage(url);
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
