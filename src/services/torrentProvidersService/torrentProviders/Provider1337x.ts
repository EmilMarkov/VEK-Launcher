import { JSDOM } from 'jsdom';
import {requestWebPage} from "@services/torrentProvidersService/helpers";

export class Provider1337x {
  async request(path: string): Promise<any> {
    return requestWebPage(`https://1337xx.to${path}`);
  }

  async getTorrents(existingTorrents: string[] = [], page = 1): Promise<string[]> {
    const torrents: string[] = [];
    return torrents;
  }
}
