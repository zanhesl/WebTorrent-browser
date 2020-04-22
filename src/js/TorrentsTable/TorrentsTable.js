// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { connect } from 'react-redux';

import { string, func, array } from 'prop-types';
import prettyBytes from '../torrentHandler/prettyBytes';

import './TorrentsTable.scss';

function TorrentsTable(props) {
  const [isTicked, setTick] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [torrentsArr, setTorrentsArr] = useState([]);

  const interval = setInterval(() => {
    setTick(!isTicked);
    console.log('tick');
    clearInterval(interval);
  }, 1000);

  useEffect(() => {
    setTorrentsArr(props.torrents);
    // console.log('updated!');
    // return () => Int(interval);
  });

  return (
    <>
      <TableContainer component={Paper}>
        <Table className="main-table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Seeds</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="center">Upload Speed</TableCell>
              <TableCell align="center">Peers</TableCell>
              <TableCell align="center">Size</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {torrentsArr
              .filter(element => element.done)
              .map((torrent, index) => (
                <TableRow key={index}>
                  <TableCell>{`${torrent.name.slice(0, 8)}${torrent.name.length > 9 ? '...' : ''}`}</TableCell>
                  <TableCell align="center">{prettyBytes(torrent.uploadSpeed)}</TableCell>
                  <TableCell align="center">{torrent.numPeers}</TableCell>
                  <TableCell align="center">{prettyBytes(torrent.length)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Table className="main-table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Downloads</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="center">Download Speed</TableCell>
              <TableCell align="center">Peers</TableCell>
              <TableCell align="center">Size</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {torrentsArr
              .filter(element => {
                return !element.done;
              })
              .map((torrent, index) => (
                <TableRow key={index}>
                  <TableCell>{torrent.name}</TableCell>
                  <TableCell align="center">{prettyBytes(torrent.downloadSpeed)}</TableCell>
                  <TableCell align="center">{torrent.numPeers}</TableCell>
                  <TableCell align="center">{prettyBytes(torrent.length)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

function mapStateToProps(state) {
  return {
    currentMagnetLink: state.currentMagnetLink,
    torrents: state.torrents,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onNewDownload: link => dispatch({ type: 'DOWNLOAD_MAGNET', payload: link }),
  };
}

TorrentsTable.propTypes = {
  currentMagnetLink: string,
  torrents: array,
  onNewDownload: func,
};

export default connect(mapStateToProps, mapDispatchToProps)(TorrentsTable);
