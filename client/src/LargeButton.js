import React, { Component } from 'react'

class LargeButton extends Component {
    render() {
        const { buttonText } = this.props;
        const { clickEvent } = this.props;
        return (
            <div onClick = {clickEvent} className="Home-button">{buttonText}</div>
        )
    }
}

export default LargeButton