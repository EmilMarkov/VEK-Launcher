import { all, call, put, takeLatest } from 'redux-saga/effects';
import TorrentService from '@/services/torrentService/torrentService';
import {
  handleTorrentFileSuccess,
  handleTorrentFileFailure,
  handleMagnetLinkSuccess,
  handleMagnetLinkFailure,
} from '@store/actionCreators/torrents';
import {
  HandleTorrentFileRequest,
  HandleMagnetLinkRequest,
  HANDLE_TORRENT,
  HANDLE_MAGNET
} from '@/types/torrents';

const torrentService = new TorrentService();

function* handleTorrentFileSaga(action: HandleTorrentFileRequest): Generator<any, void, any> {
  try {
    const torrent: ReturnType<typeof torrentService.handleTorrentFile> = yield call(torrentService.handleTorrentFile, action.filePath);
    yield put(handleTorrentFileSuccess(torrent));
  } catch (error) {
    yield put(handleTorrentFileFailure((error as Error)?.message ?? 'An unknown error occurred'));
  }
}

function* handleMagnetLinkSaga(action: HandleMagnetLinkRequest): Generator<any, void, any> {
  try {
    const torrent: ReturnType<typeof torrentService.handleMagnetLink> = yield call(torrentService.handleMagnetLink, action.magnetLink);
    yield put(handleMagnetLinkSuccess(torrent));
  } catch (error) {
    yield put(handleMagnetLinkFailure((error as Error)?.message ?? 'An unknown error occurred'));
  }
}

function* torrentSaga(): Generator<any, void, any> {
  yield all([
    yield all([takeLatest((action: any) => action.type === HANDLE_TORRENT && action.status === 'REQUEST', handleTorrentFileSaga)]),
    yield all([takeLatest((action: any) => action.type === HANDLE_MAGNET&& action.status === 'REQUEST', handleMagnetLinkSaga)]),
  ]);
}

export default torrentSaga;
