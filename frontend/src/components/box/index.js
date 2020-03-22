import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './box.css';

export default class Box extends React.Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const { position, onClick, value, isDisabled } = this.props;
        if (value || isDisabled) return;
        onClick(position);
    }

    render() {
        const { value } = this.props;
        return(
            <div className={`box${value === 'X' ? ' bgyellow' : ''}`} onClick={this.handleClick}>
                {value}
            </div>
        );
    }
}
Box.propTypes = {
    onClick: PropTypes.func.isRequired,
    value: PropTypes.string,
    position: PropTypes.number.isRequired,
    isDisabled: PropTypes.bool,
};
Box.defaultProps = {
    onClick: _.noop,
    value: '',
    isDisabled: false,
};