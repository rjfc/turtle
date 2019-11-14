import React, { Component } from 'react'

class BackButton extends Component {
    render() {
        const { clickEvent } = this.props;
        return (
            <div onClick = {clickEvent} className="Back-button">&laquo; BACK</div>
        )
    }
}

export default BackButton