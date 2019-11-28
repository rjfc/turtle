import React, { Component } from 'react'
import LogoHeader from "./LogoHeader";
import PrinterStats from "./PrinterStats";

class PrintingScreen extends Component {
    render() {
        const { modelName } = this.props;
        return (
            <div>
                <LogoHeader headerClass = {"Printer-stats-printing-header"} />
                <PrinterStats modelName = {modelName}/>
            </div>
        )
    }
}

export default PrintingScreen