import React, { Component } from 'react'
import Logo from './logo.png'

const PortStatusDisplay = props => {
    const status = props.portStatus
    return (
        <h2 className="Home-printer-status">PRINTER STATUS: {status}</h2>
    )
}

const HomeHeader = () => {
    return (
        <div className="Home-header">
            <img className="Home-header-logo" src={Logo} alt="Turtle logou"/>
            <h1 className="Home-header-text">Turtle</h1>
        </div>
    )
};

class Home extends Component {
    render() {
        const { portStatus } = this.props

        return (
            <home>
                <PortStatusDisplay portStatus = { portStatus }/>
                <HomeHeader />
            </home>
        )
    }
}

export default Home