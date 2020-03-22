import React from 'react';
import PropTypes from 'prop-types';
import BoxComponent from '../box';

import './ticTacToe.css';

function BoxHOC(clickHandler, isDisabled = false) {
    return (props) => (
        <BoxComponent isDisabled={isDisabled} onClick={clickHandler} {...props} />
    );
}

export default class TicTacToe extends React.Component {
    constructor() {
        super();
        this.handleBoxClick = this.handleBoxClick.bind(this);
        this.handleReplay = this.handleReplay.bind(this);
        this.box = BoxHOC(this.handleBoxClick);
    }

    handleReplay() {
        this.props.onReplay();
    }

    handleBoxClick(position) {
        this.props.clickedAtBoxPosition(position);
    }

    getStatusText() {
        const { 
            game: { status, playTurnPlayer1, winner = '' }, 
            player1Name, player2Name, isPlayer1Me 
        } = this.props;
        switch(status) {
            case 'started':
                let playerName = player2Name;
                if (playTurnPlayer1) {
                    if (isPlayer1Me) {
                        playerName = 'Your';
                    } else {
                        playerName = player1Name;
                    }
                }
                return `Its ${playerName} turn`;
            case 'completed':
                if(winner) {
                    const playerName = winner === 'player1' ? player1Name : player2Name;
                    return `Award goes to ${playerName}`;
                }
                return 'It is a Tie. You both played well.'
            default: 
                return '';
        }
    }

    render() {
        const Box = this.box;
        const { game: { status, boxes }, player1Name, player2Name, isPlayer1Me } = this.props;
        const statusText = this.getStatusText();
        const retryDisplayClass = status === 'completed' ? 'visible' : 'hidden';

        return(
            <div>
                <div className="player-details">
                    {!isPlayer1Me && <div>Player 1: {player1Name} </div>}
                    <div className='bgyellow'>
                        {isPlayer1Me ? player1Name : player2Name}
                        , you are Player 
                        {isPlayer1Me ? 1: 2}
                    </div>
                    {isPlayer1Me &&  <div>Player 2: {player2Name} </div>}
                </div>
                <div className="status">{statusText}</div>
                <div className="box-lane">
                    <Box position={0} value={boxes[0]} />
                    <Box position={1} value={boxes[1]} />
                    <Box position={2} value={boxes[2]} />
                </div>
                <div className="box-lane">
                    <Box position={3} value={boxes[3]} />
                    <Box position={4} value={boxes[4]} />
                    <Box position={5} value={boxes[5]} />
                </div>
                <div className="box-lane">
                    <Box position={6} value={boxes[6]} />
                    <Box position={7} value={boxes[7]} />
                    <Box position={8} value={boxes[8]} />
                </div>
                <div className={`retry ${retryDisplayClass}`} onClick={this.handleReplay}>
                    Want to play again?
                </div>
            </div>
        );
    }
}
TicTacToe.propTypes = {
    isPlayer1Me: PropTypes.bool.isRequired,
    clickedAtBoxPosition: PropTypes.func.isRequired,
    game: PropTypes.shape({
        status: PropTypes.string, 
        playTurnPlayer1: PropTypes.bool, 
        winner: PropTypes.string, 
        boxes: PropTypes.array 
    }),
    player1Name: PropTypes.string,
    player2Name: PropTypes.string,
    onReplay: PropTypes.func.isRequired,
};