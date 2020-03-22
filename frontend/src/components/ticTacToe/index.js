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

    componentDidUpdate(prevProps) {
        if((prevProps.game.winner !== this.props.game.winner) && this.props.game.winner) {
            this.handleDisable();
            this.forceUpdate();
        }
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
        this.props.clickedAtBoxPosition(position);
    }

    getStatusText() {
        const { game: { status, playTurnPlayer1, winner = '' } } = this.props;
        switch(status) {
            case 'started':
                const playerName = playTurnPlayer1 ? 'Player One' : 'Player Two';
                return `${playerName} turn`;
            case 'completed':
                if(winner) {
                    const playerName = winner === 'player1' ? 'Player One' : 'Player Two';
                    return `Award goes to ${playerName}`;
                }
                return 'Is a Tie. You both played well.'
            default: 
                return '';
        }
    }

    render() {
        const Box = this.box;
        const { game: { status, boxes } } = this.props;
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
    clickedAtBoxPosition: PropTypes.func.isRequired,
    game: PropTypes.shape({
        status: PropTypes.string, 
        playTurnPlayer1: PropTypes.bool, 
        winner: PropTypes.string, 
        boxes: PropTypes.array 
    })
};
TicTacToe.defaultProps = {

};