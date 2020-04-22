import React, { useEffect } from 'react';
import { array, func } from 'prop-types';

import { connect } from 'react-redux';
import AddTorrent from '../AddTorrent';
import TorrentsTable from '../TorrentsTable';

import { getTorrentsInfo, resurrectAllTorrents } from '../torrentHandler/torrentHandler';

import './App.scss';

function App(props) {
  useEffect(() => {
    resurrectAllTorrents();
    // const interval = setInterval(() => {
    const data = getTorrentsInfo();
    props.onNewTorrents(data);
    // }, 1000);
    // return () => clearTimeout(interval);
  }, []);
  return (
    <div className="main-app">
      <img className="main-logo" src="assets/img/WebTorrent.png" alt="Webtorrent" />
      <div className="main-app__content">
        <div className="add-torrent-wrapper">
          <AddTorrent />
        </div>
        <TorrentsTable />
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    torrents: state.torrents,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onNewTorrents: torrents => dispatch({ type: 'UPDATE_TORRENT', payload: torrents }),
  };
}

App.propTypes = {
  torrents: array,
  onNewTorrents: func,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
