import Webtorrent from 'webtorrent';
// import Idb from 'indexeddb-chunk-store';
import Idbkv from 'idb-kv-store';

// const parsetorrent = require('parse-torrent');

const client = new Webtorrent();
const torrents = new Idbkv('torrents');
const { ipcRenderer } = window.require('electron');

export function destroyTorrent(infoHash) {
  ipcRenderer.send('destroy-torrent', infoHash);
  torrents.remove(infoHash);
  indexedDB.deleteDatabase(infoHash);
}

export function seedTorrent(freeMemory) {
  ipcRenderer.send('seed-torrent', freeMemory);
  ipcRenderer.once('seed-torrent', (event, args) => {
    const [metaInfo, filePath] = args;
    metaInfo.filePath = filePath;
    metaInfo.seed = true;
    torrents.add(metaInfo.infoHash, metaInfo);
  });
}

function resurrectTorrent(metadata) {
  if (typeof metadata === 'object' && metadata != null) {
    if (client.get(metadata.infoHash)) return; // check if torrent exists
    ipcRenderer.send('resurrect-torrent', metadata);
  }
}

export function resurrectAllTorrents() {
  // Itterates through all metadata from metadata store and attempts to resurrect them!
  torrents.iterator((err, cursor) => {
    if (err) throw err;
    if (cursor) {
      if (typeof cursor.value === 'object') {
        resurrectTorrent(cursor.value);
      }
      cursor.continue();
    }
  });
}

export function getTorrent(torrentId, freememory) {
  ipcRenderer.send('add-torrent', [torrentId, freememory]); // send call to main process to operate with fs
  ipcRenderer.once('add-torrent', (event, args) => {
    const [metaInfo, filePath] = args;
    metaInfo.filePath = filePath;
    torrents.add(metaInfo.infoHash, metaInfo);
  });
}
