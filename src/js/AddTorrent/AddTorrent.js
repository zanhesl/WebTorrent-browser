import React, { useState, useEffect } from 'react';

import WebTorrent from 'webtorrent';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import dragDrop from 'drag-drop';

import { connect } from 'react-redux';

import './AddTorrent.scss';
import { string, func } from 'prop-types';
import { addInputFiles } from '../torrentHandler/torrentHandler';

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

  useEffect(() => {
    const client = new WebTorrent();

    // When user drops files on the browser, create a new torrent and start seeding it!
    dragDrop('body', files => {
      client.seed(files, torrent => {
        console.log('Client is seeding:', torrent.infoHash);
      });
    });
  });

  return (
    <>
      <div className="add-torrent">
        <form noValidate autoComplete="off">
          <TextField
            id="outlined-basic"
            label="Enter magnet URL:"
            variant="outlined"
            value={link}
            onChange={handleLinkChange}
          />
        </form>
        <Button variant="contained" color="primary" onClick={() => props.onNewDownload(link)}>
          Download
        </Button>
      </div>
      <div className="drop-area"></div>
      <Button variant="contained" component="label">
        Choose File:
        <input type="file" style={{ display: 'none' }} ref={fileInput} multiple />
      </Button>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Upload
      </Button>
    </>
  );
}

function mapStateToProps(state) {
  return {
    currentMagnetLink: state.currentMagnetLink,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onNewDownload: link => dispatch({ type: 'DOWNLOAD_MAGNET', payload: link }),
  };
}

AddTorrent.propTypes = {
  currentMagnetLink: string,
  onNewDownload: func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTorrent);
