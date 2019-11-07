import React, { Component } from 'react'

const HomeHeader = () => {
    return (
        <h1 className="Home-header">Turtle</h1>
    )
};

class Home extends Component {
    render() {
        return (
            <home>
                <HomeHeader />
            </home>
        )
    }
}

export default Home