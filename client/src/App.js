import React, { Component }  from 'react';
import './App.css';
import Home from './Home.js';

class App extends Component {
    state = {
        portStatusResponse: '',
        timeElapsedResponse: '',
        hotendTemperatureResponse: '',
        currentPositionResponse: ''
    };

    componentDidMount() {
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

    getPortStatus = async () => {
        const response = await fetch('/port/status');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    getTimeElapsed = async () => {
        const response = await fetch('/stats/timeElapsed');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    getHotendTemperature = async () => {
        const response = await fetch('/stats/hotendTemperature');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    getCurrentPosition = async () => {
        const response = await fetch('/stats/currentPosition');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        return body;
    };


    render() {
        return (
            <div className="App">
                <Home button1Text = {"PRINTER STATISTICS"}
                      button2Text = {"SEARCH 3D MODELS"}
                      portStatus = {this.state.portStatusResponse}
                      Label1Name = {"Time Elapsed"}
                      Label1Value = {this.state.timeElapsedResponse}
                      Label2Name = {"Hotend Temperature"}
                      Label2Value = {this.state.hotendTemperatureResponse + "°"}
                      Label3Name = {"X Position"}
                      Label3Value = {this.state.currentPositionResponse.X}
                      Label4Name = {"Y Position"}
                      Label4Value = {this.state.currentPositionResponse.Y}
                      Label5Name = {"Z Position"}
                      Label5Value = {this.state.currentPositionResponse.Z}
                      placeholderText = {"Search 3D models"}
                      formAction = {"/models/search"}>

                </Home>

            </div>
        );
    }
}

export default App;