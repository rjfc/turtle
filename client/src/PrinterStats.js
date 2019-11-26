import React, { Component } from 'react'
import PrinterStatsLabel from "./PrinterStatsLabel";
import socketIOClient from "socket.io-client";

class PrinterStats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: 0,
            endpoint: "http://10.36.23.89:5000/", //can change to http://127.0.0.1:5000  to run on local machine,
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
        //Very simply connect to the socket
        const socket = socketIOClient(endpoint);
        //Listen for data on the "outgoing data" namespace and supply a callback for what to do when we get one. In this case, we set a state variable'
        setInterval(async () => {
            socket.emit("get printer stats");
        }, 1000);

        socket.on("printer stats", data => this.setState({printerStats: data}));
    }

    render() {
        return (
            <div>
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