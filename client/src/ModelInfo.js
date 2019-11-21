import React, { Component } from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import LogoHeader from "./LogoHeader";
import ViewOtherModelsButton from "./ViewOtherModelsButton";
import PrintModelButton from "./PrintModelButton";

class ModelInfo extends Component {
    render() {
        const { modelName } = this.props;
        const { modelThumbnail } = this.props;
        const { viewOtherModelsClickEvent } = this.props;
        const { printModelClickEvent } = this.props;
        return (
            <div>
                <ViewOtherModelsButton clickEvent = {viewOtherModelsClickEvent}/>
                <LogoHeader headerClass = {"Model-info-header"} />
                <div className="flexbox-container">
                    <div className="flexbox-item fixed">
                        <div className="Model-info-container">
                            <span className="Model-info-name">{modelName}</span>
                            <img className="Model-info-thumbnail" alt={modelThumbnail} src = {modelThumbnail} />
                        </div>
                    </div>
                </div>
                <PrintModelButton clickEvent = {printModelClickEvent}/>
            </div>
        )
    }
}

export default ModelInfo