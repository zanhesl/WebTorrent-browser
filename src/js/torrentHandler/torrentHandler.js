import Webtorrent from 'webtorrent';
import Idb from 'indexeddb-chunk-store';
import Idbkv from 'idb-kv-store';

const parsetorrent = require('parse-torrent');

const client = new Webtorrent();
const torrents = new Idbkv('torrents');

export function destroyTorrent(torrent) {
  torrent.destroy();
  torrents.remove(torrent.infoHash);
  indexedDB.deleteDatabase(torrent.infoHash);
}

async function addTorrent(files, memory) {
  // Adds files to WebTorrent client, storing them in the indexedDB store.
  const torrent = client.seed(files, { store: Idb });

  const info = torrent.on('metadata', () => {
    // Once generated, stores the metadata for later use when re-adding the torrent!
    const metaInfo = parsetorrent(torrent.torrentFile);
    if (metaInfo.length >= memory) {
      console.log('Not enough memory!');
      destroyTorrent(torrent);
      return true;
    }
    torrents.add(metaInfo.infoHash, metaInfo);
    console.log(`[${torrent.infoHash}] Seeding torrent`);
    return false;
  });
  torrent.on('done', () => {
    console.log(`[${torrent.infoHash}] Import into indexedDB done`);
    // Checks to make sure that ImmediateChunkStore has finished writing to store before destroying the torrent!
  });

  return info;
}

export function addInputFiles(files, freeMemory) {
  if (files.length <= 0) {
    return false;
  }
  // Splits the FileList into an array of files.
  const input = Array.prototype.slice.call(files);
  const errFlag = addTorrent(input, freeMemory);
  return errFlag;
}

function resurrectTorrent(metadata) {
  if (typeof metadata === 'object' && metadata != null) {
    if (client.get(metadata.infoHash)) return; // check if torrent exists
    const torrent = client.add(metadata, { store: Idb });
    torrent.on('metadata', () => {
      console.log(`[${metadata.infoHash}] Resurrecting torrent`);
    });
    torrent.on('done', () => {
      console.log(`[${metadata.infoHash}] Loaded torrent from indexedDB store`);
    });
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

export function getTorrentsInfo() {
  return client.torrents;
}

export function getTorrent(torrentId, freeMemory) {
  return client.add(torrentId, { store: Idb }, torrent => {
    const metaInfo = parsetorrent(torrent.torrentFile);

    if (metaInfo.length >= freeMemory) {
      console.log('Not enough memory!');
      destroyTorrent(torrent);
      return true;
    }
    torrents.add(metaInfo.infoHash, metaInfo);
    torrent.on('error', function(err) {
      console.log(err);
    });

    torrent.on('done', () => {
      console.log('torrent download finished');
    });
    return false;
  });
}
