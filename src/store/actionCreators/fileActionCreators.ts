import {
  FetchFileFailure, FetchFileRequest, FetchFileSuccess, IFile,
} from '@/types/file';

export const fetchFileRequest = (path: string): FetchFileRequest => ({
  type: 'FETCH_FILE',
  status: 'REQUEST',
  path,
});

export const fetchFileSuccess = (file: IFile): FetchFileSuccess => ({
  type: 'FETCH_FILE',
  status: 'SUCCESS',
  file,
});

export const fetchFileFailure = (message: string): FetchFileFailure => ({
  type: 'FETCH_FILE',
  status: 'FAILURE',
  message,
});