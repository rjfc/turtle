import React, { Component } from 'react'
import Logo from "./logo.png";

class LogoHeader extends Component {
    render() {
        const { headerClass } = this.props;
        return (
            <div className = {headerClass}>
                <img className="Header-logo" src={Logo} alt="Turtle logo"/>
                <h1 className="Header-text">Turtle</h1>
            </div>
        )
    }
}

export default LogoHeader