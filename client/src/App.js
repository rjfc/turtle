import React, { Component }  from 'react';
import './App.css';
import Home from './Home.js';
import PrinterStats from './PrinterStats.js';

class App extends Component {
    state = {
        portStatusResponse: '',
        timeElapsedResponse: '',
    };

    componentDidMount() {
        try {
            setInterval(async () => {
                this.getPortStatus()
                    .then(res => this.setState({ portStatusResponse: res.express }))
                    .catch(err => console.log(err));
                //TODO: only get time elapsed if user is on the printer stats page
                this.getTimeElapsed()
                    .then(res => this.setState({ timeElapsedResponse: res.express }))
                    .catch(err => console.log(err));
            }, 1000);
        } catch(e) {
            console.log(e);
        }

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

    /*handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch('/api/world', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: this.state.post }),
        });
        const body = await response.text();

        this.setState({ responseToPost: body });
    };*/

    render() {
        return (
            <div className="App">
                <Home button1Text = {"PRINTER STATISTICS"}
                      button2Text = {"SEARCH 3D MODELS"}
                      portStatus = {this.state.portStatusResponse}
                      Label1Name = {"Time Elapsed"}
                      Label1Value = {this.state.timeElapsedResponse}>
                    <PrinterStats />
                </Home>
                {  /*<form onSubmit={this.handleSubmit}>

                    <input
                        type="text"
                        value={this.state.post}
                        onChange={e => this.setState({ post: e.target.value })}
                    />
                    <button type="submit">Submit</button>
                </form>
                <p>{this.state.responseToPost}</p>*/}
            </div>
        );
    }
}

export default App;