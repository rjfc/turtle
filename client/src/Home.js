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
/*
    searchModels = async e => {
        e.preventDefault();
        const response = await fetch('/models/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: this.state.post }),
        });
        const body = await response.text();

        this.setState({ responseToPost: body });
    };
*/
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
        else if (this.state.searchModelsActive && !this.state.homeActive && !this.state.printerStatsActive) {
            return (
                <div className="Search-models-container">

                    <SearchModels placeholderText = { placeholderText } formAction = {"/models/search"} />
                </div>
            )
        }
    }
}

export default Home