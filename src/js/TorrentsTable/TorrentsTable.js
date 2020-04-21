import React from 'react';

import { connect } from 'react-redux';

import './TorrentsTable.scss';
import { string, func } from 'prop-types';

function TorrentsTable() {
  return <div></div>;
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

TorrentsTable.propTypes = {
  currentMagnetLink: string,
  onNewDownload: func,
};

export default connect(mapStateToProps, mapDispatchToProps)(TorrentsTable);
