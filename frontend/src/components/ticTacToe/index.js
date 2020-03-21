import React from 'react';
import PropTypes from 'prop-types';
import BoxComponent from '../box';

import './ticTacToe.css';

function BoxHOC(clickHandler) {
    return (props) => <BoxComponent onClick={clickHandler} {...props} />
}

export default class TicTacToe extends React.Component {
    constructor() {
        super();
        this.box = BoxHOC(this.handleBoxClick);
        this.state = {
            status: '',
            squares: Array(9).fill(null),
        }
    }

    handleBoxClick(position) {
        alert(`Box positioned ${position} has been clicked`);
    }

    render() {
        const Box = this.box;
        const { squares, status } = this.state;
        return(
            <div>
                <div className="status">{status}</div>
                <div className="box-lane">
                    <Box position={0} value={squares[0]} />
                    <Box position={1} value={squares[1]} />
                    <Box position={2} value={squares[2]} />
                </div>
                <div className="box-lane">
                    <Box position={3} value={squares[3]} />
                    <Box position={4} value={squares[4]} />
                    <Box position={5} value={squares[5]} />
                </div>
                <div className="box-lane">
                    <Box position={6} value={squares[6]} />
                    <Box position={7} value={squares[7]} />
                    <Box position={8} value={squares[8]} />
                </div>
            </div>
        );
    }
}
TicTacToe.propTypes = {

};
TicTacToe.defaultProps = {

};