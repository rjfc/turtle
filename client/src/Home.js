import React, { Component } from 'react'
import LogoHeader from "./LogoHeader";
import LargeButton from "./LargeButton";
import PortStatus from "./PortStatus";
import PrinterStats from "./PrinterStats";
import BackButton from "./BackButton";

class Home extends Component {
    constructor(props){
        super(props);

        this.state = {
            homeActive: true,
            printerStatsActive: false
        };

        this.LoadHome = this.LoadHome.bind(this);
        this.LoadPrinterStats = this.LoadPrinterStats.bind(this);
    }

    LoadHome() {
        this.setState({
            homeActive: true,
            printerStatsActive: false
        });
    }

    LoadPrinterStats() {
        this.setState({
            homeActive: false,
            printerStatsActive: true
        });
    }

    render() {
        const { portStatus } = this.props;
        const { button1Text } = this.props;
        const { button2Text } = this.props;
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
        if (this.state.printerStatsActive && !this.state.homeActive) {
            return (
                <div className="Printer-status-container">
                    <BackButton clickEvent = { this.LoadHome } />
                    <LogoHeader headerClass = {"Printer-stats-header"} />
                    <PrinterStats Label1Name = { Label1Name }
                                  Label1Value = { Label1Value }
                                  Label2Name = { Label2Name }
                                  Label2Value = { Label2Value }
                                  Label3Name = { Label3Name }
                                  Label3Value = { Label3Value }
                                  Label4Name = { Label4Name }
                                  Label4Value = { Label4Value }
                                  Label5Name = { Label5Name }
                                  Label5Value = { Label5Value }/>
                    <PortStatus portStatus = { portStatus }/>
                </div>
            )
        }
        else if (this.state.homeActive && !this.state.printerStatsActive) {
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
}

export default Home