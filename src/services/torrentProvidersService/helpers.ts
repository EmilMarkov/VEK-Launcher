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
