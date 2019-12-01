import React, { Component } from 'react'
import LogoHeader from "./LogoHeader";
import PrinterStats from "./PrinterStats";
import PortStatus from "./PortStatus";

class PrintingScreen extends Component {
    render() {
        const { modelName } = this.props;
        const { portStatus} = this.props;
        return (
            <div>
                <LogoHeader headerClass = {"Printer-stats-printing-header"} />
                <PrinterStats modelName = {modelName}/>
                <PortStatus portStatus = {portStatus}/>
            </div>
        )
    }
}

export default PrintingScreen