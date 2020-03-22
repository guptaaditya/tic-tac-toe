import React from 'react';
import './App.css';
import TicTacToe from './components/ticTacToe'

class App extends React.Component {
  state = {
    isUserConnected: false
  };
  
  componentDidMount() {

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <TicTacToe />
        </header>
      </div>
    );
  }
}

export default App;
