import React, { useState, useEffect } from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import { connect } from 'react-redux';

import { func, array, number } from 'prop-types';
import { destroyTorrent } from '../torrentHandler/torrentHandler';
import prettyBytes from '../torrentHandler/prettyBytes';

import './TorrentsTable.scss';

const REFRESH_RATE = 1000;
const RESTRICTED_LENGTH = 9;
const PERCENT_MULTIPLIER = 100;

function TorrentsTable(props) {
  const [isTicked, setTick] = useState(false);
  const [torrentsArr, setTorrentsArr] = useState([]);

  const interval = setInterval(() => {
    setTick(!isTicked);
    clearInterval(interval);
  }, REFRESH_RATE);

  useEffect(() => {
    setTorrentsArr(props.torrents);
    const currentMemory = props.torrents.reduce((sum, elem) => sum + elem.length, 0);
    if (props.dedicatedMemory - currentMemory !== props.freeMemory) {
      props.updateFreeMem(currentMemory);
    }
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
                  <TableCell>
                    {torrent.name
                      ? `${torrent.name.slice(0, RESTRICTED_LENGTH - 1)}${
                          torrent.name.length > RESTRICTED_LENGTH ? '...' : ''
                        }`
                      : ''}
                  </TableCell>
                  <TableCell align="center">{prettyBytes(torrent.uploadSpeed)}</TableCell>
                  <TableCell align="center">{torrent.numPeers}</TableCell>
                  <TableCell align="center">
                    {prettyBytes(torrent.length)}
                    <div className="icon-wrapper" onClick={() => destroyTorrent(torrent)}>
                      <DeleteOutlineIcon />
                    </div>
                  </TableCell>
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
                  <TableCell>
                    {torrent.name
                      ? `${torrent.name.slice(0, RESTRICTED_LENGTH - 1)}${
                          torrent.name.length > RESTRICTED_LENGTH ? '...' : ''
                        }`
                      : ''}
                    <LinearProgress
                      variant="determinate"
                      color="secondary"
                      value={Math.round(torrent.progress * PERCENT_MULTIPLIER)}
                    />
                  </TableCell>
                  <TableCell align="center">{prettyBytes(torrent.downloadSpeed)}</TableCell>
                  <TableCell align="center">{torrent.numPeers}</TableCell>
                  <TableCell align="center">
                    {prettyBytes(torrent.length)}
                    <div className="icon-wrapper" onClick={() => destroyTorrent(torrent)}>
                      <DeleteOutlineIcon />
                    </div>
                  </TableCell>
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
    torrents: state.torrents,
    freeMemory: state.freeMemory,
    dedicatedMemory: state.dedicatedMemory,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onNewDownload: link => dispatch({ type: 'DOWNLOAD_MAGNET', payload: link }),
    updateFreeMem: mem => dispatch({ type: 'CALCULATE_FREE_MEMORY', payload: mem }),
  };
}

TorrentsTable.propTypes = {
  torrents: array,
  onNewDownload: func,
  updateFreeMem: func,
  freeMemory: number,
  dedicatedMemory: number,
};

export default connect(mapStateToProps, mapDispatchToProps)(TorrentsTable);
