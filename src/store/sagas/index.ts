import { all, fork } from 'redux-saga/effects';
import fileSaga from '@store/sagas/fileSagas';

function* rootSaga() {
  yield all([
    fork(fileSaga),
  ]);
}

export default rootSaga;