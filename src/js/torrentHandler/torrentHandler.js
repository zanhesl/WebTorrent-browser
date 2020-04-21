import Webtorrent from 'webtorrent';
import idb from 'indexeddb-chunk-store';
import Idbkv from 'idb-kv-store';

const parsetorrent = require('parse-torrent');

export const client = new Webtorrent();
const torrents = new Idbkv('torrents');

function addTorrent(files) {
  // Adds files to WebTorrent client, storing them in the indexedDB store.
  const torrent = client.seed(files, { store: idb });
  torrent.on('metadata', () => {
    // Once generated, stores the metadata for later use when re-adding the torrent!
    torrents.add(parsetorrent(torrent.torrentFile));
    console.log(`[${torrent.infoHash}] Seeding torrent`);
  });
  torrent.on('done', () => {
    console.log(`[${torrent.infoHash}] Import into indexedDB done`);
    // Checks to make sure that ImmediateChunkStore has finished writing to store before destroying the torrent!
  });
}

// eslint-disable-next-line import/prefer-default-export
export function addInputFiles(files) {
  if (files.length <= 0) {
    return;
  }
  // Splits the FileList into an array of files.
  const input = Array.prototype.slice.call(files);
  addTorrent(input);
}

function resurrectTorrent(metadata) {
  if (typeof metadata === 'object' && metadata != null) {
    if (client.get(metadata.infoHash)) return; // check if torrent exists
    const torrent = client.add(metadata, { store: idb });
    torrent.on('metadata', () => {
      console.log(`[${metadata.infoHash}] Resurrecting torrent`);
    });
    torrent.on('done', () => {
      console.log(`[${metadata.infoHash}] Loaded torrent from indexedDB store`);
    });
  }
}

// eslint-disable-next-line import/prefer-default-export
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

export function getTorrent(torrentId) {
  client.add(torrentId, { store: idb }, torrent => {
    torrent.on('error', function(err) {
      console.log(err);
    });

    torrent.on('done', () => {
      console.log('torrent download finished');
    });
  });
}
