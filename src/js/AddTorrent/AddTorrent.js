import React, { useState } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
// import dragDrop from 'drag-drop';

import { connect } from 'react-redux';

import './AddTorrent.scss';
import { func } from 'prop-types';
import { Paper } from '@material-ui/core';
import { addInputFiles, getTorrent } from '../torrentHandler/torrentHandler';

function AddTorrent(props) {
  const [link, setLink] = useState('');

  const handleLinkChange = event => {
    setLink(event.target.value);
  };

  const fileInput = React.createRef();

  const handleSubmit = event => {
    event.preventDefault();
    addInputFiles(fileInput.current.files);
  };

  const handleDownload = magnetLink => {
    props.onNewDownload(magnetLink);
    getTorrent(magnetLink);
    setLink('');
  };

  return (
    <Paper className="paper-container">
      <div className="add-torrent">
        <Button variant="contained" color="primary" onClick={() => handleDownload(link)}>
          Download
        </Button>
        <form noValidate autoComplete="off" className="magnet-form">
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
        <div className="drop-area"></div>
        <div className="input-files__choose-file">
          <Button variant="contained" className="select-files" color="primary" component="label">
            Choose File:
            <input type="file" style={{ display: 'none' }} ref={fileInput} />
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Upload
          </Button>
        </div>
      </div>
    </Paper>
  );
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    onNewDownload: link => dispatch({ type: 'DOWNLOAD_MAGNET', payload: link }),
  };
}

AddTorrent.propTypes = {
  onNewDownload: func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTorrent);
