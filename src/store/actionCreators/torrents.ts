import {
  FETCH_TORRENTS,
  HANDLE_TORRENT,
  HANDLE_MAGNET,
  FetchTorrentsRequest,
  FetchTorrentsSuccess,
  FetchTorrentsFailure,
  ITorrent,
} from '@/types/torrents';

export const fetchTorrentsRequest = (): FetchTorrentsRequest => ({
  type: FETCH_TORRENTS,
  status: 'REQUEST',
});

export const fetchTorrentsSuccess = (torrents: ITorrent[]): FetchTorrentsSuccess => ({
  type: FETCH_TORRENTS,
  status: 'SUCCESS',
  torrents,
});

export const fetchTorrentsFailure = (message: string): FetchTorrentsFailure => ({
  type: FETCH_TORRENTS,
  status: 'FAILURE',
  message,
});

export const handleTorrentFileRequest = (filePath: string) => ({
  type: HANDLE_TORRENT,
  status: 'REQUEST',
  filePath,
});

export const handleTorrentFileSuccess = (torrent: any) => ({
  type: HANDLE_TORRENT,
  status: 'SUCCESS',
  torrent,
});

export const handleTorrentFileFailure = (error: string) => ({
  type: HANDLE_TORRENT,
  status: 'FAILURE',
  error,
});

export const handleMagnetLinkRequest = (magnetLink: string) => ({
  type: HANDLE_MAGNET,
  status: 'REQUEST',
  magnetLink,
});

export const handleMagnetLinkSuccess = (torrent: any) => ({
  type: HANDLE_MAGNET,
  status: 'SUCCESS',
  torrent,
});

export const handleMagnetLinkFailure = (error: string) => ({
  type: HANDLE_MAGNET,
  status: 'FAILURE',
  error,
});
