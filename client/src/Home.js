import React, { Component } from 'react'
import LogoHeader from "./LogoHeader";
import LargeButton from "./LargeButton";
import PortStatus from "./PortStatus";
import PrinterStats from "./PrinterStats";


class Home extends Component {
    constructor(props){
        super(props);

        this.state = {
            printerStatsActive: false,
        };

        this.LoadPrinterStats = this.LoadPrinterStats.bind(this);
    }

    LoadPrinterStats() {
        this.setState({ printerStatsActive: true });
    }

    render() {
        const { portStatus } = this.props;
        const { button1Text } = this.props;
        const { button2Text } = this.props;
        const { Label1Name } = this.props;
        const { Label1Value } = this.props;
        if (this.state.printerStatsActive) {
            return (
                <div className="Printer-status-container">
                    <LogoHeader headerClass = {"Printer-stats-header"} />
                    <PrinterStats Label1Name = { Label1Name }
                                  Label1Value = { Label1Value }/>
                    <PortStatus portStatus = { portStatus }/>
                </div>
            )
        }
        return (
            <div className="Home-container">
                <LogoHeader headerClass = {"Home-header"} />
                <LargeButton buttonText = { button1Text }
                             clickEvent = { this.LoadPrinterStats }/>
                <br/>
                <LargeButton buttonText = { button2Text }/>
                <PortStatus portStatus = { portStatus }/>
            </div>
        )
    }
}

export default Home