import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';

import * as fileService from '@services/fileService'
import { fetchFileSuccess, fetchFileFailure } from '@store/actionCreators/fileActionCreators';
import { FETCH_FILE, IFile } from '@/types/file';

function* fetchFileSaga(action: any) {
  try {
    const file: IFile = yield call(fileService.fetchFile, action.path);
    yield put(fetchFileSuccess(file));
  } catch (error) {
    yield put(fetchFileFailure((error as Error)?.message ?? 'An unknown error occurred'));
  }
}

function* fileSaga() {
  yield all([takeLatest((action: any) => action.type === FETCH_FILE && action.status === 'REQUEST', fetchFileSaga)]);
}

export default fileSaga;