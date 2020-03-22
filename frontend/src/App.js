import React from 'react';
import './App.css';
import TicTacToe from './components/ticTacToe'
import { connect } from 'react-redux';

class App extends React.Component {
  render() {
    const { isServerConnected } = this.props;
    return (
      <div className="App">
        <header className="App-header">
          {!isServerConnected && <div className='loading'>Connecting server...</div>}
          {isServerConnected && <TicTacToe />}
        </header>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    isServerConnected: state.tictactoe.isServerConnected
  }),
  (dispatch) => ({
  })
)(App);
