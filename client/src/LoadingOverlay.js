import React, { Component } from 'react'
import Loader from "react-loader-spinner";

class LoadingOverlay extends Component {
    render() {
        const { overlayStyle } = this.props;
        const { overlayText } = this.props;
        return (
            <div className="Loading-overlay" style={ overlayStyle }>
                <span className="Loading-text">{ overlayText }</span>
                <div className="Loading-spinner">
                    <Loader
                        type="TailSpin"
                        color="#0eba48"
                        height={100}
                        width={100} />
                </div>
            </div>
        )
    }
}

export default LoadingOverlay