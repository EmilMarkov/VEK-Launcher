import { invoke } from '@tauri-apps/api';
import { IFile } from '@/types/file';

export const fetchFile = async (path: string): Promise<IFile> => invoke<IFile>('fetch_file', { filePath: path });