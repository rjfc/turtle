import React, { Component } from 'react'

class ViewOtherModelsButton extends Component {
    render() {
        const { clickEvent } = this.props;
        return (
            <div onClick = {clickEvent} className="View-other-models-button">&laquo; OTHER MODELS</div>
        )
    }
}

export default ViewOtherModelsButton