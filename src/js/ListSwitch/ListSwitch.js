import React, { Component } from 'react';
import { connect } from 'react-redux';
import { func, bool } from 'prop-types';

// import { createMuiTheme } from '@material-ui/core/styles';
// import { ThemeProvider } from '@material-ui/styles';

import './ListSwitch.scss';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class ListSwitch extends Component {
  state = {
    value: 0,
  };

  a11yProps(index) {
    return {
      id: `action-tab-${index}`,
      'aria-controls': `action-tabpanel-${index}`,
    };
  }

  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
    const newSelectedType = !newValue;
    if (newSelectedType !== this.props.downUpLoadSortFlag) {
      this.props.onChangeList(newSelectedType);
    }
  };

  render() {
    return (
      <>
        <AppBar position="static" style={{ backgroundColor: 'transparent' }}>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="action tabs example"
          >
            <Tab label="Uploads" {...this.a11yProps(0)} />
            <Tab label="Downloads" {...this.a11yProps(1)} />
          </Tabs>
        </AppBar>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    downUpLoadSortFlag: state.downUpLoadSortFlag,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChangeList: info => dispatch({ type: 'CHANGE_FLAG', payload: info }),
  };
}

ListSwitch.propTypes = {
  onChangeList: func,
  downUpLoadSortFlag: bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListSwitch);
