import React, { Component } from 'react'
import socketIOClient from "socket.io-client";
import PrinterStatsLabel from "./PrinterStatsLabel";

class PrinterStats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: 0,
            endpoint: "http://192.168.43.68:5000/", // Can change to http://127.0.0.1:5000  to run on local machine,
            printerStats: {
                timeElapsed: '',
                temperature: '',
                position: {
                    X: '',
                    Y: '',
                    Z: ''
                }
            }
        };
    }

    componentDidMount() {
        const {endpoint} = this.state;
        // Connect to the socket
        const socket = socketIOClient(endpoint);
        setInterval(async () => {
            socket.emit("get printer stats");
        }, 1000);

        socket.on("printer stats", data => this.setState({printerStats: data}));
    }

    render() {
        const { modelName } = this.props;
        return (
            <div>
                <span style={{display: {modelName} ? 'block' : 'none'}} className="Printing-screen-printing-label">{modelName} is being printed.</span>
                <PrinterStatsLabel LabelName={"Time Elapsed"} LabelValue={this.state.printerStats.timeElapsed}/>
                <PrinterStatsLabel LabelName={"Temperature"} LabelValue={this.state.printerStats.temperature}/>
                <PrinterStatsLabel LabelName={"X Position"} LabelValue={this.state.printerStats.position.X}/>
                <PrinterStatsLabel LabelName={"Y Position"} LabelValue={this.state.printerStats.position.Y}/>
                <PrinterStatsLabel LabelName={"Z Position"} LabelValue={this.state.printerStats.position.Z}/>
            </div>
        )
    }
}

export default PrinterStats