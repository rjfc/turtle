import React, { Component } from 'react'

class PortStatus extends Component {
    render() {
        const { portStatus } = this.props;
        return (
            <h2 className="Home-printer-status">PRINTER STATUS: {portStatus}</h2>
        )
    }
}

export default PortStatus