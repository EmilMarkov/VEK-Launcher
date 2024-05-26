import process from 'process';
import parseTorrent, {toMagnetURI} from 'parse-torrent';
import { Buffer } from 'buffer'; // Импортируем Buffer явно

self.process = process;

self.onmessage = async ({ data: buffer }) => {
    try {
        const torrentBuffer = Buffer.from(buffer);

        const torrent = await parseTorrent(torrentBuffer);

        self.postMessage(toMagnetURI(torrent));
    } catch (error) {
        self.postMessage(null);
    }
};
