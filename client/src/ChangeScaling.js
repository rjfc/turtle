import React, { Component } from 'react'

class ChangeScaling extends Component {
    render() {
        const { scalingFactor } = this.props;
        const { increaseFactor } = this.props;
        const { decreaseFactor } = this.props;
        return (
            <div>
                <span className="Scaling-Change-Header">Scaling Factor:</span>
                <div className="Scaling-Change-Container">
                    <button className="Scaling-Decrease-Button" onClick={ decreaseFactor }>-</button>
                    <button className="Scaling-Increase-Button" onClick={ increaseFactor }>+</button>
                    <span className="Scaling-Value">{ scalingFactor }</span>
                </div>
            </div>
        )
    }
}

export default ChangeScaling