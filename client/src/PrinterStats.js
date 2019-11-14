import React, { Component } from 'react'
import PrinterStatsLabel from "./PrinterStatsLabel";

class PrinterStats extends Component {
    render() {
        const { Label1Name } = this.props;
        const { Label1Value } = this.props;
        const { Label2Name } = this.props;
        const { Label2Value } = this.props;
        const { Label3Name } = this.props;
        const { Label3Value } = this.props;
        const { Label4Name } = this.props;
        const { Label4Value } = this.props;
        const { Label5Name } = this.props;
        const { Label5Value } = this.props;
        return (
            <div className="Printer-stats-container">
                <PrinterStatsLabel LabelName={Label1Name} LabelValue={Label1Value}/>
                <PrinterStatsLabel LabelName={Label2Name} LabelValue={Label2Value}/>
                <PrinterStatsLabel LabelName={Label3Name} LabelValue={Label3Value}/>
                <PrinterStatsLabel LabelName={Label4Name} LabelValue={Label4Value}/>
                <PrinterStatsLabel LabelName={Label5Name} LabelValue={Label5Value}/>
            </div>
        )
    }
}

export default PrinterStats