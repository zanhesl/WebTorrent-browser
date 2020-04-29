import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AddToQueueIcon from '@material-ui/icons/AddToQueue';
import Typography from '@material-ui/core/Typography';
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
      <Link to="/stream" className="stream-button">
        <AddToQueueIcon />
        <Typography variant="button" className="stream-button__caption">
          Stream torrents
        </Typography>
      </Link>
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
