import React, { Component } from 'react'
import socketIOClient from "socket.io-client";
import LogoHeader from "./LogoHeader";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import ModelInfo from "./ModelInfo";
import BackButton from "./BackButton";

class SearchModels extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: 0,
            endpoint: "http://10.38.134.211:5000/", //can change to http://127.0.0.1:5000  to run on local machine
            searchResultsActive: true,
            searchModelsInfo: '',
            searchValue: '',
            modelInfo: ''
        };

        this.sendSearchData = this.sendSearchData.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.openModel = this.openModel.bind(this);
        this.loadSearchResults = this.loadSearchResults.bind(this);
        this.printModel = this.printModel.bind(this);
    }

    componentDidMount() {
        const {endpoint} = this.state;
        //Very simply connect to the socket
        const socket = socketIOClient(endpoint);
        //Listen for data on the "outgoing data" namespace and supply a callback for what to do when we get one. In this case, we set a state variable'
        socket.on("search models thumbnails", data => this.setState({searchModelsInfo: data}));
        socket.on("model info", data => this.setState({modelInfo: data, searchResultsActive: false}));
    }

    sendSearchData() {
        const {endpoint} = this.state;
        const socket = socketIOClient(endpoint);

        socket.emit("search models", this.state.searchValue);
    }

    onChange(e) {
        this.setState({ searchValue: e.target.value });
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.sendSearchData();
        }
    };

    openModel(idNumber) {
        const {endpoint} = this.state;
        const socket = socketIOClient(endpoint);
        socket.emit("get model info", idNumber);
    }

    loadSearchResults() {
        this.setState({
            searchResultsActive: true,
            modelInfo: ''
        });
    }

    printModel(url) {
        const {endpoint} = this.state;
        const socket = socketIOClient(endpoint);
        socket.emit("print model", url);
    }

    render() {
        const { searchModelsInfo } = this.state;
        const { modelInfo } = this.state;
        const { placeholderText } = this.props;
        if (searchModelsInfo === '' && modelInfo === '') {
            return (
                <div>
                    <BackButton clickEvent = { this.LoadHome } />
                    <LogoHeader headerClass = {"Load-models-header"} />
                    <div className="Large-search-container">
                        <div className="Large-search-submit" onClick = {this.sendSearchData}>GO</div>
                        <div className="Large-search-input-wrapper">
                            <input className="Large-search" type="text" placeholder={placeholderText}
                                   onChange={this.onChange} onKeyDown={this.handleKeyDown} name="searchValue"/>
                        </div>
                    </div>
                </div>
            )
        }
        else if (searchModelsInfo !== '' && modelInfo === '' && this.state.searchResultsActive) {
            return (
                <div>
                    <BackButton clickEvent = { this.LoadHome } />
                    <LogoHeader headerClass = {"Load-models-loaded-header"} />
                    <div className="Large-search-loaded-container">
                        <div className="Large-search-submit" onClick={this.sendSearchData}>GO</div>
                        <div className="Large-search-input-wrapper">
                            <input className="Large-search" type="text" placeholder={placeholderText}
                                   onChange={this.onChange} onKeyDown={this.handleKeyDown} name="searchValue"/>
                        </div>
                    </div>
                    <Carousel
                        infiniteLoop
                        useKeyboardArrows
                        emulateTouch
                        swipeable
                        dynamicHeight
                        showIndicators={false}
                        showThumbs={false}
                        showStatus={false}
                        className="Load-models-loaded-carousel">
                        {searchModelsInfo.modelThumbnails.map((imageSource, i) => {
                            return (
                                <div onClick={() => {this.openModel(i)}} key={i}>
                                    <img src={imageSource} alt={"3D model thumbnail"} className="Load-models-loaded-thumbnail"/>
                                </div>
                            )
                        })}
                    </Carousel>
                    <span className="Load-models-loaded-indication-text">Select a model for print options.</span>
                    {   /* <AliceCarousel
                        mouseTrackingEnabled
                        dotsDisabled={true}
                        ref={(el) => (this.Carousel = el)}
                        className="Load-models-loaded-carousel">
                        {searchModelsThumbnails.map((imageSource) => {
                            return <img src={imageSource} alt={"3D model thumbnail"} onDragStart={handleOnDragStart} className="Load-models-loaded-thumbnail"/>;
                        })}
                    </AliceCarousel>
                    <button onClick={() => this.Carousel.slidePrev()}>Prev button</button>
                    <button onClick={() => this.Carousel.slideNext()}>Next button</button>*/}
                </div>
            )
        }
        else if (!this.state.searchResultsActive) {
            return (
                <ModelInfo modelName={modelInfo.name} modelThumbnail={modelInfo.thumbnail} viewOtherModelsClickEvent={this.loadSearchResults} printModelClickEvent={() => {this.printModel(modelInfo.url)}}/>
            )
        }
    }
}

export default SearchModels