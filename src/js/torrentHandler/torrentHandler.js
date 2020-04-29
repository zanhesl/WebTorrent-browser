import Webtorrent from 'webtorrent';
// import Idb from 'indexeddb-chunk-store';
import Idbkv from 'idb-kv-store';
import fileTypes from './fileTypes';
// const parsetorrent = require('parse-torrent');

const client = new Webtorrent();
const torrents = new Idbkv('torrents');
const { ipcRenderer } = window.require('electron');

export function destroyTorrent(infoHash) {
  try {
    client.remove(infoHash);
  } catch {
    ipcRenderer.send('destroy-torrent', infoHash);
    torrents.remove(infoHash);
    indexedDB.deleteDatabase(infoHash);
  }
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
  ipcRenderer.once('add-into-ram', (evt, torrentLink) => {
    client.add(torrentLink);
  });
}

export function getTorrentsList() {
  const arr = client.torrents.map(el => ({
    name: el.name,
    downloadSpeed: el.downloadSpeed,
    done: el.done,
    uploadSpeed: el.uploadSpeed,
    progress: el.progress,
    numPeers: el.numPeers,
    length: el.length,
    infoHash: el.infoHash,
    path: el.path,
    magnet: el.magnetURI,
  }));
  return arr;
}

export function streamTorrent(magnet, id) {
  client.add(magnet, torrent => {
    // Torrents can contain many files. Let's use the .mp4 file
    const files = torrent.files.filter(elem => {
      let isStreamable = false;
      fileTypes.map(type => {
        if (elem.name.endsWith(type)) isStreamable = true;
        return true;
      });
      return isStreamable;
    });
    torrent.on('done', () => console.log('finished!'));

    // setInterval(() => {
    //   console.log(file.progress);
    // }, 500);

    // Display the file by adding it to the DOM.
    // Supports video, audio, image files, and more!
    files.map(file => file.appendTo(id));
  });
}
