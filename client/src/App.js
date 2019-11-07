import React, { Component }  from 'react';
import './App.css';
import Home from './Home.js';
import SocketIO from 'socket.io-client'


const connectionConfig = {
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 100000,
    transports: ['websocket'], // you need to explicitly tell it to use websockets
};

class App extends Component {
    constructor() {
        super();
        this.socket = SocketIO('http://localhost:5000', connectionConfig);
        this.socket.on('connect', () => {
            console.log('connected to server');
        });
    }
    state = {
        response: '',
        post: '',
        responseToPost: '',
        endpoint: "localhost:5000"
    };

    componentDidMount() {
        const {endpoint} = this.state;
        //Very simply connect to the socket
        const socket = SocketIO(endpoint);
        //Listen for data on the "outgoing data" namespace and supply a callback for what to do when we get one. In this case, we set a state variable
        socket.on("port connected", data => this.setState({response: data.boolean}));
    }/*
    componentDidMount() {
        this.callApi()
            .then(res => this.setState({ response: res.express }))
            .catch(err => console.log(err));
    }*/

    callApi = async () => {
        const response = await fetch('/api/hello');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    handleSubmit = async e => {
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
    };

    render() {
        const {portStatus} = this.state;
        return (
            <div className="App">
                <Home portStatus = {portStatus}/>>
                {/*<header className="App-header">
                </header>
                <p>{this.state.response}</p>
                <form onSubmit={this.handleSubmit}>
                    <p>
                        <strong>Post to Server:</strong>
                    </p>
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