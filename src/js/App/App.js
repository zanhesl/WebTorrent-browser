import React, { useEffect } from 'react';
import { func } from 'prop-types';

import { connect } from 'react-redux';
import AddTorrent from '../AddTorrent';
import TorrentsTable from '../TorrentsTable';
import MemoryCell from '../MemoryCell';

import { getTorrentsInfo, resurrectAllTorrents } from '../torrentHandler/torrentHandler';

import './App.scss';

function App(props) {
  useEffect(() => {
    resurrectAllTorrents();
    const data = getTorrentsInfo();
    props.onNewTorrents(data);
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

function mapDispatchToProps(dispatch) {
  return {
    onNewTorrents: torrents => dispatch({ type: 'UPDATE_TORRENT', payload: torrents }),
  };
}

App.propTypes = {
  onNewTorrents: func,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
