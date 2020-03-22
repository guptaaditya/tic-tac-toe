import React from 'react';
import PlayerName from './components/playerName';
import './App.css';
import TicTacToe from './components/ticTacToe'
import { connect } from 'react-redux';
import * as actions from './actions';

class App extends React.Component {
  render() {
    const { 
      isServerConnected, isOpponentConnected, game, handleBoxClick, isPlayer1Me ,
      player1Name, player2Name, handleReplay
    } = this.props;
    
    return (
      <div className="App">
        <header className="App-header">
          {!isServerConnected && <div className='loading'>Connecting server...</div>}
          {isServerConnected && !isOpponentConnected && (
            <PlayerName />
          )}
          {isOpponentConnected && (
            <TicTacToe 
              game={game} 
              clickedAtBoxPosition={handleBoxClick} 
              isPlayer1Me={isPlayer1Me} 
              player1Name={player1Name}
              player2Name={player2Name}
              onReplay={handleReplay}
            />
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
    player1Name: state.tictactoe.player1Details.name,
    player2Name: state.tictactoe.player2Details.name,
  }),
  (dispatch) => ({
    handleReplay: () => dispatch(actions.sendMessage('restart_game')),
    handleBoxClick: (position) => dispatch(actions.clickedBox(position)),
  })
)(App);
