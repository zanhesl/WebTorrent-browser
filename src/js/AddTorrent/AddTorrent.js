import React, { useState, useEffect } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import dragDrop from 'drag-drop';

import { connect } from 'react-redux';

import './AddTorrent.scss';
import { func, number } from 'prop-types';
import { Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { seedTorrent, getTorrent } from '../torrentHandler/torrentHandler';

const { ipcRenderer } = window.require('electron');

function AddTorrent(props) {
  const [link, setLink] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState('error');

  const handleLinkChange = event => {
    setLink(event.target.value);
  };

  useEffect(() => {
    dragDrop('#drop-area', {
      onDrop: files => {
        console.log(files);
      },
    });
    ipcRenderer.on('error-message', (evt, arg) => {
      const [errText, errType] = arg;
      setErrorType(errType);
      setError(errText);
      setOpen(true);
    });
  }, []);

  const handleSubmit = event => {
    event.preventDefault();
    seedTorrent(props.freeMemory);
  };

  const handleDownload = magnetLink => {
    props.onNewDownload(magnetLink);
    getTorrent(magnetLink, props.freeMemory);
    setLink('');
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Paper className="paper-container">
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={errorType}>
          {errorType}: {error}
        </MuiAlert>
      </Snackbar>
      <div className="add-torrent">
        <Button variant="contained" color="primary" onClick={() => handleDownload(link)}>
          Download
        </Button>
        <form noValidate autoComplete="off" className="magnet-form" onSubmit={evt => evt.preventDefault()}>
          <TextField
            id="outlined-basic"
            label="Enter magnet URL:"
            variant="outlined"
            value={link}
            onChange={handleLinkChange}
            className="magnet-input"
          />
        </form>
      </div>
      <Divider />
      <div className="input-files">
        <Paper className="drop-area" id="drop-area">
          <FolderOpenIcon className="folder-icon" />
          <Typography>Drop files here</Typography>
        </Paper>
        <div className="input-files__choose-file">
          <Button variant="contained" className="select-files" color="primary" component="label" onClick={handleSubmit}>
            Choose File:
          </Button>
        </div>
      </div>
    </Paper>
  );
}

function mapStateToProps(state) {
  return {
    freeMemory: state.freeMemory,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onNewDownload: link => dispatch({ type: 'DOWNLOAD_MAGNET', payload: link }),
  };
}

AddTorrent.propTypes = {
  onNewDownload: func,
  freeMemory: number,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTorrent);
