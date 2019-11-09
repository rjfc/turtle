import React, { Component } from 'react'
import Logo from './logo.png'

const PortStatusDisplay = props => {
    const status = props.portStatus;
    return (
        <h2 className="Home-printer-status">PRINTER STATUS: {status}</h2>
    )
};

const HomeHeader = () => {
    return (
        <div className="Home-header">
            <img className="Home-header-logo" src={Logo} alt="Turtle logou"/>
            <h1 className="Home-header-text">Turtle</h1>
        </div>
    )
};

const HomeButton = props => {
    const text = props.buttonText;
    return (
        <div className="Home-button">{text}</div>
    )
};

class Home extends Component {
    render() {
        const { portStatus } = this.props;
        const { button1Text } = this.props;
        const { button2Text } = this.props;
        return (
            <div>
                <HomeHeader />
                <HomeButton buttonText = { button1Text }/>
                <HomeButton buttonText = { button2Text }/>
                <PortStatusDisplay portStatus = { portStatus }/>

            </div>
        )
    }
}

export default Home