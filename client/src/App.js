import React, { Component }  from 'react';
import './App.css';
import Home from './Home.js';

class App extends Component {
    state = {
        response: 0,
        endpoint: "http://192.168.43.68:5000/", //can change to http://127.0.0.1:5000  to run on local machine,
        printerStatus: '',
        timeElapsedResponse: '',
        hotendTemperatureResponse: '',
        currentPositionResponse: ''
    };

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