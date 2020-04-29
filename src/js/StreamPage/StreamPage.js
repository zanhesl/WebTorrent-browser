import React, { useState } from 'react';

import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';

import './StreamPage.scss';
import { streamTorrent } from '../torrentHandler/torrentHandler';

function StreamPage() {
  const [link, setLink] = useState('');
  const [streams, setStreams] = useState([]);

  const handleLinkChange = event => {
    setLink(event.target.value);
  };

  const handleDownload = magnet => {
    console.log(magnet);
    const id = `Stream-${streams.length}`;
    setStreams([...streams, id]);
    streamTorrent(magnet, `#${id}`);
    setLink('');
  };

  return (
    <div className="stream-page">
      <img className="main-logo" src="assets/img/WebTorrent.png" alt="Webtorrent" />
      <Link to="/" className="stream-button">
        <HomeIcon />
      </Link>
      <Paper className="add-stream">
        <Button variant="contained" color="primary" onClick={() => handleDownload(link)}>
          Stream
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
      </Paper>
      <Paper id="torrent-content" className="torrent-content">
        {streams.map(stream => (
          <Paper key={stream} elevation={3} id={stream} className="torrent-paper">
            <Typography variant="h5">{stream}</Typography>
          </Paper>
        ))}
      </Paper>
    </div>
  );
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps() {
  return {};
}

StreamPage.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(StreamPage);
