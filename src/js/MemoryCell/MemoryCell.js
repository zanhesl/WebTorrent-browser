import React, { useState } from 'react';

import { connect } from 'react-redux';

import { func, number } from 'prop-types';

import { Paper } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import prettyBytes from '../torrentHandler/prettyBytes';

import './MemoryCell.scss';

const MEGA_MULTIPLIER = 1000 ** 2;

function TorrentCell(props) {
  const [memory, setMemory] = useState(+prettyBytes(props.dedicatedMemory).split(' ')[0]);
  const [open, setOpen] = useState(false);

  const handleMemoryChange = event => {
    setMemory(event.target.value);
  };

  const dedicateMemory = memoryStorage => {
    if (+memoryStorage * MEGA_MULTIPLIER <= props.dedicatedMemory - props.freeMemory) {
      setOpen(true);
      return;
    }
    localStorage.setItem('memory', memoryStorage * MEGA_MULTIPLIER);
    props.onChangeMemory(+memoryStorage * MEGA_MULTIPLIER);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div className="memory-container">
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="error">
          Delete torrents first, you have more storage occupied, than entered!
        </MuiAlert>
      </Snackbar>
      <Paper className="memory-paper">
        <div className="memory-progress-wrapper">
          <CircularProgress
            variant="static"
            value={props.freeMemory.isNan ? '...' : ((props.freeMemory / props.dedicatedMemory) * 100).toFixed(0)}
            color="secondary"
            className="memory-progress__progress"
          />
          <Typography>{`${prettyBytes(props.freeMemory)} / ${prettyBytes(props.dedicatedMemory)}`}</Typography>
        </div>
        <div className="change-memory">
          <Button variant="contained" color="primary" onClick={() => dedicateMemory(memory)}>
            Update
          </Button>
          <form noValidate autoComplete="off" className="magnet-form" onSubmit={evt => evt.preventDefault()}>
            <TextField
              id="outlined-basic"
              label="Dedicated disk space(mB):"
              variant="outlined"
              value={memory}
              onChange={handleMemoryChange}
              className="magnet-input"
            />
          </form>
        </div>
      </Paper>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    dedicatedMemory: state.dedicatedMemory,
    freeMemory: state.freeMemory,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChangeMemory: mem => dispatch({ type: 'UPDATE_MEMORY', payload: mem }),
  };
}

TorrentCell.propTypes = {
  onChangeMemory: func,
  dedicatedMemory: number,
  freeMemory: number,
};

export default connect(mapStateToProps, mapDispatchToProps)(TorrentCell);
