import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class PlayerName extends React.PureComponent {
    state = {
        name: '',
        isPlayerNameSaved: false
    }

    constructor() {
        super();
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleEnterGame = this.handleEnterGame.bind(this);
    }

    handleNameChange(e) {
        this.setState({ name: e.target.value });
    }

    handleEnterGame() {
        const { name } = this.state;
        const trimmedName = name.trim();
        if (!trimmedName) {
            alert('Please enter your display name');
            return;
        }
        this.setState({ isPlayerNameSaved: true, name: trimmedName });
        this.props.savePlayerName(trimmedName);
    }

    render() {
        const { isPlayerNameSaved, name } = this.state;
        return(
            <>
                {!isPlayerNameSaved && (
                    <>
                        <input type='text' onChange={this.handleNameChange} />
                        <button onClick={this.handleEnterGame}>Enter the Game</button>
                    </>
                )}
                {isPlayerNameSaved && (
                    <div>Hi {name}, Please wait for opponent to join</div>
                )}
            </>
        );
    }
}
PlayerName.propTypes = {
    savePlayerName: PropTypes.func.isRequired,
};


export default connect(
    null,
    (dispatch) => ({
        savePlayerName: name => dispatch(actions.savePlayerName(name)),
    })
)(PlayerName);  