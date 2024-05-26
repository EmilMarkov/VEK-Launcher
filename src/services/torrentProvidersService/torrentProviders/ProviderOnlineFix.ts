import { JSDOM } from 'jsdom';
import {requestWebPage} from "@services/torrentProvidersService/helpers";

export class ProviderOnlineFix {
  async request(path: string): Promise<any> {
    return requestWebPage(`https://online-fix.me${path}`);
  }

  async getTorrents(existingTorrents: string[] = [], page = 1): Promise<string[]> {
    const torrents: string[] = [];
    return torrents;
  }
}
