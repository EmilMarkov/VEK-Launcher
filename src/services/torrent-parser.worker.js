const { parentPort } = require('worker_threads');
const parseTorrent = require('parse-torrent');
const fs = require('fs');

parentPort.on('message', async (filePath) => {
  try {
    const data = fs.readFileSync(filePath); // Используем синхронное чтение для простоты
    const torrent = parseTorrent(data);
    parentPort.postMessage({ success: true, data: torrent });
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  }
});
