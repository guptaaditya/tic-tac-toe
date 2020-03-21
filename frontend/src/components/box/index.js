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
        const { position, onClick } = this.props;
        onClick(position);
    }

    render() {
        return(
            <div className="box" onClick={this.handleClick}>
                {this.props.value}
            </div>
        );
    }
}
Box.propTypes = {
    onClick: PropTypes.func.isRequired,
    value: PropTypes.string,
    position: PropTypes.number.isRequired,
};
Box.defaultProps = {
    onClick: _.noop,
    value: '',
};