import React, { useState } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// import dragDrop from 'drag-drop';

import { connect } from 'react-redux';

import './AddTorrent.scss';
import { string, func } from 'prop-types';
import { Paper } from '@material-ui/core';
import { addInputFiles, getTorrentsInfo, getTorrent } from '../torrentHandler/torrentHandler';

function AddTorrent(props) {
  const [link, setLink] = useState('');

  const handleLinkChange = event => {
    setLink(event.target.value);
  };

  const fileInput = React.createRef();

  const handleSubmit = event => {
    event.preventDefault();
    addInputFiles(fileInput.current.files);
    const data = getTorrentsInfo();
    props.onNewTorrents(data);
  };

  const handleDownload = magnetLink => {
    props.onNewDownload(magnetLink);
    getTorrent(magnetLink);
    const data = getTorrentsInfo();
    console.log(data);

    props.onNewTorrents(data);
    setLink('');
  };
  // useEffect(() => {
  //   const client = new WebTorrent();

  //   // When user drops files on the browser, create a new torrent and start seeding it!
  //   dragDrop('body', files => {
  //     client.seed(files, torrent => {
  //       console.log('Client is seeding:', torrent.infoHash);
  //     });
  //   });
  // }, []);

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
      <div className="input-files">
        <div className="drop-area"></div>
        <div className="input-files__choose-file">
          <Button variant="contained" color="primary" component="label">
            Choose File:
            <input type="file" style={{ display: 'none' }} ref={fileInput} multiple />
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Upload
          </Button>
        </div>
      </div>
    </Paper>
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
    onNewTorrents: torrents => dispatch({ type: 'UPDATE_TORRENT', payload: torrents }),
  };
}

AddTorrent.propTypes = {
  currentMagnetLink: string,
  onNewDownload: func,
  onNewTorrents: func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTorrent);
