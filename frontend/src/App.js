import React from 'react';
import PlayerName from './components/playerName';
import './App.css';
import TicTacToe from './components/ticTacToe'
import { connect } from 'react-redux';
import * as actions from './actions';

class App extends React.Component {
  render() {
    const { isServerConnected, isOpponentConnected, game, handleBoxClick } = this.props;
    return (
      <div className="App">
        <header className="App-header">
          {!isServerConnected && <div className='loading'>Connecting server...</div>}
          {isServerConnected && !isOpponentConnected && (
            <PlayerName />
          )}
          {isOpponentConnected && (
            <TicTacToe game={game} clickedAtBoxPosition={handleBoxClick} />
          )}
        </header>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    isServerConnected: state.tictactoe.isServerConnected,
    isOpponentConnected: state.tictactoe.isOpponentConnected,
    isPlayer1Me: state.tictactoe.isPlayer1Me,
    game: state.tictactoe.game,
  }),
  (dispatch) => ({
    handleBoxClick: (position) => dispatch(actions.clickedBox(position)),
  })
)(App);
