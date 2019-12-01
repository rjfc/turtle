import React, { Component }  from 'react';
import './App.css';
import Home from './Home.js';
import socketIOClient from "socket.io-client";

class App extends Component {
    state = {
        response: 0,
        endpoint: "http://10.36.53.98:5000/", //can change to http://127.0.0.1:5000  to run on local machine,
        printerStatus: '',
        timeElapsedResponse: '',
        hotendTemperatureResponse: '',
        currentPositionResponse: ''
    };

    componentDidMount() {
        const {endpoint} = this.state;
        //Very simply connect to the socket
        const socket = socketIOClient(endpoint);
        setInterval(async () => {
            socket.emit("get printer status");
        });
        socket.on("printer status", data => this.setState({printerStatus: data}));
        /*try {
            setInterval(async () => {
                this.getPortStatus()
                    .then(res => this.setState({ portStatusResponse: res.express }))
                    .catch(err => console.log(err));
                //TODO: only get time elapsed if user is on the printer stats page
                this.getTimeElapsed()
                    .then(res => this.setState({ timeElapsedResponse: res.express }))
                    .catch(err => console.log(err));
                this.getHotendTemperature()
                    .then(res => this.setState({ hotendTemperatureResponse: res.express }))
                    .catch(err => console.log(err));
                this.getCurrentPosition()
                    .then(res => this.setState({ currentPositionResponse: res.express }))
                    .catch(err => console.log(err));
            }, 1000);
        } catch(e) {
            console.log(e);
        }*/

    }

    /*getPortStatus = async () => {
        const response = await fetch('/port/status');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        return body;
    };
*/
    render() {
        return (
            <div className="App">
                <Home button1Text = {"PRINTER STATISTICS"}
                      button2Text = {"SEARCH 3D MODELS"}
                      placeholderText = {"Search 3D models"}
                      portStatus = {this.state.printerStatus}>
                </Home>

            </div>
        );
    }
}

export default App;