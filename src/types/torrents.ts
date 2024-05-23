import { AppActionBase } from '@/types/actions';

export interface ITorrent {
  id: Number;
  title: string;
  link: string;
}

export interface ITorrentsReducerState {
  torrents: ITorrent[];
  loading: boolean;
  error: string | null;
}

export const FETCH_TORRENTS = 'FETCH_TORRENTS';
export const HANDLE_TORRENT = 'HANDLE_TORRENT';
export const HANDLE_MAGNET = 'HANDLE_MAGNET';

export type FetchTorrentsRequest = AppActionBase<typeof FETCH_TORRENTS, 'REQUEST'>;
export type FetchTorrentsSuccess = AppActionBase<typeof FETCH_TORRENTS, 'SUCCESS'> & { torrents: ITorrent[] };
export type FetchTorrentsFailure = AppActionBase<typeof FETCH_TORRENTS, 'FAILURE'> & { message: string };

export type HandleTorrentFileRequest = AppActionBase<typeof HANDLE_TORRENT, 'REQUEST'> & { filePath: string };
export type HandleTorrentFileSuccess = AppActionBase<typeof HANDLE_TORRENT, 'SUCCESS'> & { torrent: ITorrent };
export type HandleTorrentFileFailure = AppActionBase<typeof HANDLE_TORRENT, 'FAILURE'> & { message: string };

export type HandleMagnetLinkRequest = AppActionBase<typeof HANDLE_MAGNET, 'REQUEST'> & { magnetLink: string };
export type HandleMagnetLinkSuccess = AppActionBase<typeof HANDLE_MAGNET, 'SUCCESS'> & { torrent: ITorrent };
export type HandleMagnetLinkFailure = AppActionBase<typeof HANDLE_MAGNET, 'FAILURE'> & { message: string };

export type TorrentActions =
  | FetchTorrentsRequest
  | FetchTorrentsSuccess
  | FetchTorrentsFailure
  | HandleTorrentFileRequest
  | HandleTorrentFileSuccess
  | HandleTorrentFileFailure
  | HandleMagnetLinkRequest
  | HandleMagnetLinkSuccess
  | HandleMagnetLinkFailure;
