import React, { Component } from 'react'

class PrinterStatsLabel extends Component {
    render() {
        const { LabelName } = this.props;
        const { LabelValue } = this.props;
        return (
            <div className="Printer-stats-label">
                <strong>{LabelName}:</strong> {LabelValue}
            </div>
        )
    }
}

export default PrinterStatsLabel