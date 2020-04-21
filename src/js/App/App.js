import React from 'react';

import WebTorrent from 'webtorrent';
import idb from 'idb-chunk-store';

import { connect } from 'react-redux';
import AddTorrent from '../AddTorrent';

import './App.scss';

function App() {
  const getTorrent = () => {
    const client = new WebTorrent();

    const torrentId = 'https://webtorrent.io/torrents/sintel.torrent';

    client.add(torrentId, { store: idb, path: torrentId }, torrent => {
      console.log(1);

      const interval = setInterval(() => console.log(torrent.downloadSpeed), 500);

      torrent.on('error', function(err) {
        console.log(err);
      });

      torrent.on('metadata', function() {
        console.log('meta ready');
      });

      torrent.on('done', () => {
        console.log('torrent download finished');
        console.log(torrent.files);
        clearInterval(interval);
      });
    });
  };

  return (
    <div>
      <AddTorrent />
      <button onClick={() => getTorrent()}></button>
    </div>
  );
}

App.propTypes = {};

export default connect()(App);
