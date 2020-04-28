import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import AddTorrent from '../AddTorrent';
import TorrentsTable from '../TorrentsTable';
import MemoryCell from '../MemoryCell';

import { resurrectAllTorrents } from '../torrentHandler/torrentHandler';

import './App.scss';

function App() {
  useEffect(() => {
    resurrectAllTorrents();
  }, []);
  return (
    <div className="main-app">
      <img className="main-logo" src="assets/img/WebTorrent.png" alt="Webtorrent" />
      <div className="main-app__content">
        <div className="add-torrent-wrapper">
          <AddTorrent />
          <MemoryCell />
        </div>
        <TorrentsTable />
      </div>
    </div>
  );
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps() {
  return {};
}

App.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(App);
