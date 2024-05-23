import { all, fork } from 'redux-saga/effects';
import fileSaga from '@store/sagas/fileSagas';
import torrentSaga from './torrentSagas';

function* rootSaga() {
  yield all([
    fork(fileSaga),
    fork(torrentSaga)
  ]);
}

export default rootSaga;