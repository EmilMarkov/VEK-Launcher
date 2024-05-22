import { AppActionBase } from '@/types/actions';

export interface IFile {
  filePath: string,
  basename: string,
  fileType: string,
  isDir: boolean,
  isHidden: boolean,
  isFile: boolean,
  isSystem: boolean,
  size: number,
  readonly: boolean,
  lastModified: Date,
  lastAccessed: Date,
  created: Date,
  isTrash: boolean,
}

export interface IFileReducerState {
  files: Record<string, IFile>
}

export const FETCH_FILE = 'FETCH_FILE';

export type FetchFileRequest = AppActionBase<typeof FETCH_FILE, 'REQUEST'> & { path: string };
export type FetchFileSuccess = AppActionBase<typeof FETCH_FILE, 'SUCCESS'> & { file: IFile };
export type FetchFileFailure = AppActionBase<typeof FETCH_FILE, 'FAILURE'> & { message: string };

export type FileActions = FetchFileRequest | FetchFileSuccess | FetchFileFailure;
export type FileActionTypes = typeof FETCH_FILE | '';