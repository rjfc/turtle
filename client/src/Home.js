import React, { Component } from 'react'
import LogoHeader from "./LogoHeader";
import LargeButton from "./LargeButton";
import PortStatus from "./PortStatus";
import PrinterStats from "./PrinterStats";
import BackButton from "./BackButton";
import SearchModels from "./SearchModels";
import socketIOClient from "socket.io-client";

class Home extends Component {
    constructor(props){
        super(props);

        this.state = {
            homeActive: true,
            printerStatsActive: false,
            searchModelsActive : false,
            description: '',
            portStatus: ''
        };

        this.LoadHome = this.LoadHome.bind(this);
        this.LoadPrinterStats = this.LoadPrinterStats.bind(this);
        this.LoadSearchModels = this.LoadSearchModels.bind(this);
    }
    componentDidMount() {
        const {endpoint} = this.state;
        //Very simply connect to the socket
        const socket = socketIOClient(endpoint);
         setInterval(async () => {
             if (!this.state.searchModelsActive) {
                socket.emit("get printer status");
             }
         });
        socket.on("printer status", data => this.setState({portStatus: data}));
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
        const { portStatus } = this.state;
        const { button2Text } = this.props;
        const { placeholderText } = this.props;

        if (this.state.homeActive && !this.state.printerStatsActive && !this.state.searchModelsActive) {
            return (
                <div className="Home-container">
                    <LogoHeader headerClass = {"Home-header"} />
                    {/*<LargeButton buttonText = { button1Text }
                                 clickEvent = { this.LoadPrinterStats }/>
                    <br/>*/}
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
                    <SearchModels placeholderText = { placeholderText } loadHomeEvent = { this.LoadHome } portStatus = {portStatus} />
                </div>
            )
        }
    }
}

export default Home