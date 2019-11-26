import React, { Component } from 'react'
import socketIOClient from "socket.io-client";
import LogoHeader from "./LogoHeader";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import ModelInfo from "./ModelInfo";
import BackButton from "./BackButton";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import LoadingOverlay from "./LoadingOverlay";
import PrintingScreen from "./PrintingScreen";

class SearchModels extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: 0,
            endpoint: "http://10.36.23.89:5000/", //can change to http://127.0.0.1:5000  to run on local machine
            searchResultsActive: true,
            searchModelsInfo: '',
            searchValue: '',
            modelInfo: '',
            loadingModels: false,
            loadingModelsText: '',
            printing: false,
            printingText: '',
            printingScreenActive: false
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
        socket.on("search models num results", data => this.setState({loadingModelsText: data + " results found for \"" + this.state.searchValue + "\"..."}));
        socket.on('print status', (data) => {
            if (data === "slicing") {
                this.setState({
                    printingText: "Slicing \"" + this.state.modelInfo.name + "\"..."
                });
            }
            else if (data === "printing") {
                console.log("hello");
                this.setState({
                    printingScreenActive: true
                });
            }
        });
    }

    sendSearchData() {
        const {endpoint} = this.state;
        const socket = socketIOClient(endpoint);
        this.setState({
            loadingModels: true,
            loadingModelsText: "Getting results for \"" + this.state.searchValue + "\"..."
        });
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
        this.setState({
            printing: true,
            printingText: "Downloading \"" + this.state.modelInfo.name + "\" ..."
        });
        socket.emit("print model", url);
    }

    render() {
        const { searchModelsInfo } = this.state;
        const { modelInfo } = this.state;
        const { placeholderText } = this.props;
        const { loadHomeEvent } = this.props;
        if(searchModelsInfo === '' && modelInfo === '' && !this.state.printingScreenActive) {
            return (
                <div>
                    <LoadingOverlay overlayStyle={{display: this.state.loadingModels ? 'block' : 'none'}} overlayText={ this.state.loadingModelsText } />
                    <BackButton clickEvent = { loadHomeEvent } />
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
        else if (searchModelsInfo !== '' && modelInfo === '' && this.state.searchResultsActive && !this.state.printingScreenActive) {
            return (
                <div>
                    <BackButton clickEvent = { loadHomeEvent } />
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
        else if (!this.state.searchResultsActive && !this.state.printingScreenActive) {
            return (
                <div>
                    <LoadingOverlay overlayStyle={{display: this.state.printing ? 'block' : 'none'}} overlayText={this.state.printingText} />
                    <ModelInfo modelName={modelInfo.name} modelThumbnail={modelInfo.thumbnail} viewOtherModelsClickEvent={this.loadSearchResults} printModelClickEvent={() => {this.printModel(modelInfo.url)}}/>
                </div>
            )
        }
        else if (this.state.printingScreenActive) {
            return (
                <div>
                    <PrintingScreen modelName={modelInfo.name} />
                </div>
            )
        }
    }
}

export default SearchModels