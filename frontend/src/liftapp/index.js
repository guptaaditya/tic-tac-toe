import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class LiftApp extends React.Component {
  componentDidMount() {
    this.props.connectServer();
  }

  render() {
    return this.props.children;
  }
}

export default connect(
    null,
    (dispatch) => ({
      connectServer: () => dispatch(actions.connectServer()),
    })
)(LiftApp);
