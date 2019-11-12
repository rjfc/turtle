import React, { Component } from 'react'
import PrinterStatsLabel from "./PrinterStatsLabel";

class PrinterStats extends Component {
    render() {
        const { Label1Name } = this.props;
        const { Label1Value } = this.props;
        const { Label2Name } = this.props;
        const { Label2Value } = this.props;
        return (
            <div className="Printer-stats-container">
                <PrinterStatsLabel LabelName={Label1Name} LabelValue={Label1Value}/>
                <PrinterStatsLabel LabelName={Label2Name} LabelValue={Label2Value}/>
            </div>
        )
    }
}

export default PrinterStats