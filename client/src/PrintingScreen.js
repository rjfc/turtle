import React, { Component } from 'react'

class PrintingScreen extends Component {
    render() {
        const { modelName } = this.props;
        return (
            <div>
                <span className="Printing-screen-header">"{modelName}" is being printed!</span>
            </div>
        )
    }
}

export default PrintingScreen