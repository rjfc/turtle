import React, { Component } from 'react'

class PrintModelButton extends Component {
    render() {
        const { clickEvent } = this.props;
        return (
            <div onClick = {clickEvent} className="Print-model-button">PRINT THIS MODEL</div>
        )
    }
}

export default PrintModelButton