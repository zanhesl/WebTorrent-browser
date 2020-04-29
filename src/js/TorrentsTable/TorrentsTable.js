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
import Link from '@material-ui/core/Link';

import { connect } from 'react-redux';

import { func, array, number, bool } from 'prop-types';
import ListSwitch from '../ListSwitch';
import { destroyTorrent, getTorrentsList } from '../torrentHandler/torrentHandler';
import prettyBytes from '../torrentHandler/prettyBytes';

import './TorrentsTable.scss';

const { ipcRenderer } = window.require('electron');

const REFRESH_RATE = 1000;
const RESTRICTED_LENGTH = 20;
const PERCENT_MULTIPLIER = 100;

function TorrentsTable(props) {
  const [torrentsArr, setTorrentsArr] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('tick');

      ipcRenderer.send('get-info');
      ipcRenderer.once('get-info', (evt, arg) => {
        setTorrentsArr([...arg, ...getTorrentsList()]);
      });
    }, REFRESH_RATE);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const currentMemory = torrentsArr
      .filter(el => el.path.indexOf('tmp') === -1)
      .reduce((sum, elem) => sum + elem.length, 0);
    if (props.dedicatedMemory - props.freeMemory !== currentMemory) {
      props.updateFreeMem(currentMemory);
    }
  });

  return (
    <>
      <TableContainer component={Paper}>
        <ListSwitch
          downloads={torrentsArr.filter(element => !element.done).length}
          uploads={torrentsArr.filter(element => element.done).length}
        />
        <Table className="main-table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className="long-cell">Name</TableCell>
              <TableCell className="short-cell" align="center">
                Speed
              </TableCell>
              <TableCell className="short-cell" align="center">
                Peers
              </TableCell>
              <TableCell className="short-cell" align="center">
                Size
              </TableCell>
              <TableCell className="short-cell" align="center">
                Magnet
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {torrentsArr
              .filter(element => element.done === props.downUpLoadSortFlag)
              .map((torrent, index) => (
                <TableRow key={index}>
                  <TableCell className="long-cell">
                    {torrent.name
                      ? `${torrent.name.slice(0, RESTRICTED_LENGTH - 1)}${
                          torrent.name.length > RESTRICTED_LENGTH ? '...' : ''
                        }`
                      : ''}
                    {props.downUpLoadSortFlag ? (
                      <></>
                    ) : (
                      <LinearProgress
                        variant="determinate"
                        color="secondary"
                        value={Math.round(torrent.progress * PERCENT_MULTIPLIER)}
                      />
                    )}
                  </TableCell>
                  <TableCell className="short-cell" align="center">
                    {props.downUpLoadSortFlag ? prettyBytes(torrent.uploadSpeed) : prettyBytes(torrent.downloadSpeed)}
                  </TableCell>
                  <TableCell className="short-cell" align="center">
                    {torrent.numPeers}
                  </TableCell>
                  <TableCell className="short-cell" align="center">
                    {prettyBytes(torrent.length)}
                    <div className="icon-wrapper" onClick={() => destroyTorrent(torrent.infoHash)}>
                      <DeleteOutlineIcon />
                    </div>
                  </TableCell>
                  <TableCell className="magnet-cell" align="center">
                    <Link href={torrent.magnet} onClick={() => console.log(torrent.magnet)}>
                      Link to magnet
                    </Link>
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
    downUpLoadSortFlag: state.downUpLoadSortFlag,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onNewDownload: link => dispatch({ type: 'DOWNLOAD_MAGNET', payload: link }),
    onNewTorrents: torrents => dispatch({ type: 'UPDATE_TORRENT', payload: torrents }),
    updateFreeMem: mem => dispatch({ type: 'CALCULATE_FREE_MEMORY', payload: mem }),
  };
}

TorrentsTable.propTypes = {
  torrents: array,
  onNewDownload: func,
  freeMemory: number,
  dedicatedMemory: number,
  downUpLoadSortFlag: bool,
  onNewTorrents: func,
  updateFreeMem: func,
};

export default connect(mapStateToProps, mapDispatchToProps)(TorrentsTable);
