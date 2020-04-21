import React, { useLayoutEffect } from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { connect } from 'react-redux';

import { string, func, array, object, number } from 'prop-types';
import prettyBytes from '../torrentHandler/prettyBytes';

// import client from '../torrentHandler/torrentHandler';

import './TorrentCell.scss';

function TorrentCell(props) {
  useLayoutEffect(() => {
    console.log('update!', props.info.downloadSpeed);
  }, [props.info.downloadSpeed]);

  return (
    <TableRow>
      <TableCell>{props.info.name}</TableCell>
      <TableCell align="center">
        {prettyBytes(props.torrents[props.key] ? props.torrents[props.key].downloadSpeed : 0)}
      </TableCell>
      <TableCell align="center">{props.info.numPeers}</TableCell>
      <TableCell align="center">{prettyBytes(props.info.length)}</TableCell>
    </TableRow>
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

TorrentCell.propTypes = {
  currentMagnetLink: string,
  torrents: array,
  onNewDownload: func,
  info: object,
  key: number,
};

export default connect(mapStateToProps, mapDispatchToProps)(TorrentCell);
