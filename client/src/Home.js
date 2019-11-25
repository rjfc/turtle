import React, { Component } from 'react'
import LogoHeader from "./LogoHeader";
import LargeButton from "./LargeButton";
import PortStatus from "./PortStatus";
import PrinterStats from "./PrinterStats";
import BackButton from "./BackButton";
import SearchModels from "./SearchModels";

class Home extends Component {
    constructor(props){
        super(props);

        this.state = {
            homeActive: true,
            printerStatsActive: false,
            searchModelsActive : false,
            description: ''
        };

        this.LoadHome = this.LoadHome.bind(this);
        this.LoadPrinterStats = this.LoadPrinterStats.bind(this);
        this.LoadSearchModels = this.LoadSearchModels.bind(this);
    }

    LoadHome() {
        this.setState({
            homeActive: true,
            printerStatsActive: false,
            searchModelsActive: false
        });
    }

    LoadPrinterStats() {
        this.setState({
            homeActive: false,
            printerStatsActive: true,
            searchModelsActive: false
        });
    }

    LoadSearchModels() {
        this.setState({
            homeActive: false,
            printerStatsActive: false,
            searchModelsActive: true
        });
    }

    render() {
        const { portStatus } = this.props;
        const { button1Text } = this.props;
        const { button2Text } = this.props;
        const { placeholderText } = this.props;

        if (this.state.homeActive && !this.state.printerStatsActive && !this.state.searchModelsActive) {
            return (
                <div className="Home-container">
                    <LogoHeader headerClass = {"Home-header"} />
                    <LargeButton buttonText = { button1Text }
                                 clickEvent = { this.LoadPrinterStats }/>
                    <br/>
                    <LargeButton buttonText = { button2Text }
                                 clickEvent = { this.LoadSearchModels }/>
                    <PortStatus portStatus = { portStatus }/>
                </div>
            )
        }
        else if (this.state.printerStatsActive && !this.state.homeActive && !this.state.searchModelsActive) {
            return (
                <div className="Printer-stats-container">
                    <BackButton clickEvent = { this.LoadHome } />
                    <LogoHeader headerClass = {"Printer-stats-header"} />
                    <PrinterStats />
                    <PortStatus portStatus = { portStatus }/>
                </div>
            )
        }
        else if (this.state.searchModelsActive && !this.state.homeActive && !this.state.printerStatsActive) {
            return (
                <div className="Search-models-container">
                    <SearchModels placeholderText = { placeholderText } />
                </div>
            )
        }
    }
}

export default Home