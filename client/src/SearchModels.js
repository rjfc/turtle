import React, { Component } from 'react'
import socketIOClient from "socket.io-client";
import LogoHeader from "./LogoHeader";
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'

class SearchModels extends Component {
    constructor() {
        super();
        this.state = {
            response: 0,
            searchModelsThumbnails: '',
            endpoint: "http://127.0.0.1:5000",
            searchValue: ''
        };

        this.sendSearchData = this.sendSearchData.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentDidMount() {

        const {endpoint} = this.state;
        //Very simply connect to the socket
        const socket = socketIOClient(endpoint);
        //Listen for data on the "outgoing data" namespace and supply a callback for what to do when we get one. In this case, we set a state variable'
        socket.on("search models thumbnails", data => this.setState({searchModelsThumbnails: data}));
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

    render() {
        const { searchModelsThumbnails } = this.state;
        const { placeholderText } = this.props;
        const handleOnDragStart = (e) => e.preventDefault();
        if (searchModelsThumbnails === '') {
            return (
                <div>
                    <LogoHeader headerClass = {"Load-models-header"} />
                    <div className="Large-search-container">
                        <input className="Large-search-submit" type="submit" value="GO" onClick={this.sendSearchData}/>
                        <div className="Large-search-input-wrapper">
                            <input className="Large-search" type="text" placeholder={placeholderText}
                                   onChange={this.onChange} onKeyDown={this.handleKeyDown} name="searchValue"/>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div>
                    <LogoHeader headerClass = {"Load-models-loaded-header"} />
                    <div className="Large-search-loaded-container">
                        <input className="Large-search-submit" type="submit" value="GO" onClick={this.sendSearchData}/>
                        <div className="Large-search-input-wrapper">
                            <input className="Large-search" type="text" placeholder={placeholderText}
                                   onChange={this.onChange} onKeyDown={this.handleKeyDown} name="searchValue"/>
                        </div>
                    </div>
                    <AliceCarousel mouseTrackingEnabled dotsDisabled={true}>
                        {searchModelsThumbnails.map((imageSource) => {
                            return <img src={imageSource} onDragStart={handleOnDragStart} className="yours-custom-class"/>;
                        })}
                    </AliceCarousel>

                </div>
            )
        }
    }
}

export default SearchModels