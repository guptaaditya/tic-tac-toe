import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { getMyName } from '../../reducer/selectors.js';
import { showToast } from '../../helper';

class PlayerName extends React.PureComponent {
    name = '';

    constructor() {
        super();
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleEnterGame = this.handleEnterGame.bind(this);
    }

    handleNameChange(e) {
        this.name = e.target.value || '';
    }

    handleEnterGame() {
        const trimmedName = this.name.trim();
        if (!trimmedName) {
            showToast('Please enter your display name', 'error');
            return;
        }
        this.props.savePlayerName(trimmedName);
    }

    render() {
        const { name = '' } = this.props;
        const isPlayerNameSaved = Boolean(name.trim());
        return(
            <>
                {!isPlayerNameSaved && (
                    <>
                        <div className='input-name'>
                            <input placeholder="Please Enter your name" type='text' onChange={this.handleNameChange} />
                        </div>
                        <div className='btn-enter-game'>
                            <button onClick={this.handleEnterGame}>Enter the Game</button>
                        </div>
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
    name: PropTypes.string,
    savePlayerName: PropTypes.func.isRequired,
};


export default connect(
    state => ({
        name: getMyName(state),
    }),
    (dispatch) => ({
        savePlayerName: name => {
            dispatch(actions.savePlayerName(name));
            dispatch(actions.sendMessage('join_game', { name }));
        },
    })
)(PlayerName);  