/* eslint-disable import/no-extraneous-dependencies */
const { ipcMain, dialog } = require('electron');
const fs = require('fs');
const Webtorrent = require('webtorrent');

const client = new Webtorrent();
const parsetorrent = require('parse-torrent');

module.exports = {
  initTorrents: () => {
    // download torrent to disk
    ipcMain.on('add-torrent', (event, arg) => {
      const [torrentLink, freeMemory] = arg;
      dialog
        .showOpenDialog({
          properties: ['openDirectory'],
        })
        .then(fileName => {
          if (fileName.filePaths[0] === undefined) {
            console.log('Not saved');
            event.reply('error-message', ['not saved, because no folder selected', 'error']);
            return;
          }
          client.add(torrentLink, { path: fileName.filePaths[0] }, torrent => {
            const metaInfo = parsetorrent(torrent.torrentFile);

            if (metaInfo.length >= freeMemory) {
              // if disk space is lacking, torrent downloads into RAM
              torrent.destroy();
              event.reply('error-message', [' not enough free memory, using RAM instead', 'warning']);
              event.reply('add-into-ram', torrentLink);
            } else {
              event.reply('add-torrent', [metaInfo, fileName.filePaths[0]]);
              event.reply('calculate-memory');
            }

            torrent.on('error', function(err) {
              console.log(err);
            });

            torrent.on('done', () => {
              console.log('torrent download finished');
            });
          });
        });
    });

    // get current info about torrents
    ipcMain.on('get-info', event => {
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
      event.reply('get-info', arr);
    });

    // resurrect current torrents
    ipcMain.on('resurrect-torrent', (event, metadata) => {
      if (metadata.seed) {
        const torrent = client.seed(metadata.filePath, { path: metadata.filePath });
        event.reply('calculate-memory');
        torrent.on('metadata', () => {
          console.log(`[${metadata.infoHash}] Resurrecting seed`);
        });
        torrent.on('done', () => {
          console.log(`[${metadata.infoHash}] Loaded seed from disk`);
        });
      } else {
        const torrent = client.add(metadata, { path: metadata.filePath });
        event.reply('calculate-memory');
        torrent.on('metadata', () => {
          console.log(`[${metadata.infoHash}] Resurrecting torrent`);
        });
        torrent.on('done', () => {
          console.log(`[${metadata.infoHash}] Loaded torrent from disk`);
        });
      }
    });

    // delete selected torrent
    ipcMain.on('destroy-torrent', (event, infoHash) => {
      client.remove(client.torrents.filter(el => el.infoHash === infoHash)[0]);
      event.reply('calculate-memory');
    });

    // start seeding torrents
    ipcMain.on('seed-torrent', (event, freeMemory) => {
      dialog
        .showOpenDialog({
          properties: ['openFile', 'openDirectory'],
        })
        .then(fileName => {
          if (fileName.filePaths[0] === undefined) {
            console.log('Not seeding');
            event.reply('error-message', ['not saved, because no folder selected', 'warning']);
            return;
          }
          if (fs.statSync(fileName.filePaths[0]).size >= freeMemory) {
            event.reply('error-message', ['not enough free memory', 'error']);
            return;
          }
          client.seed(fileName.filePaths[0], { path: fileName.filePaths[0] }, torrent => {
            const metaInfo = parsetorrent(torrent.torrentFile);

            event.reply('seed-torrent', [metaInfo, fileName.filePaths[0]]);
            event.reply('calculate-memory');
            torrent.on('error', function(err) {
              console.log(err);
            });
          });
        });
    });
  },
};
