import React, { Component } from 'react'
import PrinterStatsLabel from "./PrinterStatsLabel";

class PrinterStats extends Component {
    render() {
        const { Label1Name } = this.props;
        const { Label1Value } = this.props;
        return (
            <div className="Printer-stats-container">
                <PrinterStatsLabel LabelName={Label1Name} LabelValue={Label1Value}/>
            </div>
        )
    }
}

export default PrinterStats