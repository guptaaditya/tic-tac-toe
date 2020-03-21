import React from 'react';
import PropTypes from 'prop-types';
import BoxComponent from '../box';

import './ticTacToe.css';
import { getWinner } from './utils';

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
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            status: 'waiting',
            boxes: Array(9).fill(null),
            playTurnPlayer1: true,
            winner: '',
        };
    }

    componentDidMount() {
        this.setState({ status: 'started' }); //when player 2 joins
    }

    handleDisable() {
        this.box = BoxHOC(this.handleBoxClick, true);
    }

    handleReplay() {
        this.box = BoxHOC(this.handleBoxClick, false);
        const initState = this.getInitialState();
        initState.status = 'started';
        this.setState(initState);
    }

    handleBoxClick(position) {
        this.setState(prevState => {
            const { boxes, playTurnPlayer1 } =  prevState;
            boxes[position] = playTurnPlayer1 ? 'X' : 'O';
            return {
                boxes,
                playTurnPlayer1: !playTurnPlayer1,
            }
        }, () => {
            const winner = getWinner(this.state.boxes);
            if (winner) {
                this.handleDisable();
                this.setState({ winner, status: 'completed' });
            }
        });
    }

    getStatusText() {
        const { status, winner, playTurnPlayer1 } = this.state;
        switch(status) {
            case 'waiting': 
                return 'Waiting for another payer to join';
            case 'started':
                const playerName = playTurnPlayer1 ? 'Player One' : 'Player Two';
                return `${playerName}: Your turn`;
            break;
            case 'completed':
                if(winner) {
                    const playerName = winner === 'X' ? 'Player One' : 'Player Two';
                    return `Award goes to ${playerName}`;
                }
                return 'Is a Tie. You both played well.'
            break;
        }
        return '';
    }

    render() {
        const Box = this.box;
        const { boxes, status } = this.state;
        const statusText = this.getStatusText();
        const retryDisplayClass = status === 'completed' ? 'visible' : 'hidden';

        return(
            <div>
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

};
TicTacToe.defaultProps = {

};