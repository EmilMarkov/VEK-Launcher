import { invoke } from '@tauri-apps/api/tauri';
import {
  removeReleaseYearFromName,
  removeSymbolsFromName,
  removeSpecialEditionFromName,
  empressFormatter,
  kaosKrewFormatter,
  fitGirlFormatter,
  removeDuplicateSpaces,
  dodiFormatter,
  removeTrash,
  xatabFormatter,
  tinyRepacksFormatter,
  gogFormatter,
  onlinefixFormatter,
} from "./formatters";

import { Torrent, TorrentInfo } from '@/types';
import { providerXatab } from '@/services/torrentProvidersService/torrentProviders/ProviderXatab';
import { providerDODI } from '@/services/torrentProvidersService/torrentProviders/ProviderDODI';
import { provider0xEMPRESS } from '@/services/torrentProvidersService/torrentProviders/Provider0xEMPRESS';
import { providerKaOsKrew } from '@/services/torrentProvidersService/torrentProviders/ProviderKaOsKrew';
import { providerOnlineFix } from '@/services/torrentProvidersService/torrentProviders/ProviderOnlineFix';
import { providerGOG } from '@/services/torrentProvidersService/torrentProviders/ProviderGOG';
import { providerTinyRepacks } from '@/services/torrentProvidersService/torrentProviders/ProviderTinyRepacks';
import { providerFitGirl } from '@/services/torrentProvidersService/torrentProviders/ProviderFitGirl';

type ProviderMapType = {
    [key: string]: {
        fetchTorrentInfo: (url: string) => Promise<TorrentInfo>
    }
};

const providerMap: ProviderMapType = {
    'DODI': providerDODI,
    '0xEMPRESS': provider0xEMPRESS,
    'KaOsKrew': providerKaOsKrew,
    'Xatab': providerXatab,
    'Online-Fix': providerOnlineFix,
    'GOG': providerGOG,
    'TinyRepacks': providerTinyRepacks,
    'FitGirl': providerFitGirl,
};

export const fetchTorrentInfo = async (torrents: Torrent[]): Promise<TorrentInfo[]> => {
  const torrentInfoPromises = torrents.map(async (torrent) => {
    const provider = providerMap[torrent.repacker as keyof ProviderMapType];
    if (provider) {
      try {
        const info = await provider.fetchTorrentInfo(torrent.torrent);
        const torrentInfo: TorrentInfo = {
          name: torrent.name,
          repacker: torrent.repacker,
          updated: info.updated,
          magnet: info.magnet
        }
        return torrentInfo;
      } catch (error) {
        console.error(`Error fetching info for ${torrent.repacker}:`, error);
        return null;
      }
    }
    return null;
  });

  const torrentInfos = await Promise.all(torrentInfoPromises);
  return torrentInfos.filter(info => info !== null) as TorrentInfo[];
};


export const pipe =
    <T>(...fns: ((arg: T) => any)[]) =>
        (arg: T) =>
            fns.reduce((prev, fn) => fn(prev), arg);

export const formatName = pipe<string>(
    removeTrash,
    removeReleaseYearFromName,
    removeSymbolsFromName,
    removeSpecialEditionFromName,
    removeDuplicateSpaces,
    (str) => str.trim()
);

export const getFileBuffer = async (url: string): Promise<Uint8Array> => {
  try {
    const arrayBuffer: ArrayBuffer = await invoke('fetch_file_buffer', { url });
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error('Error fetching file buffer:', error);
    throw error;
  }
}

export const requestWebPage = async (url: string): Promise<string> => {
  try {
    return await invoke<string>('fetch_web_content', { url });
  } catch (error) {
    console.error(`Error with responsing content from ${url}:`, error);
    return "";
  }
};
