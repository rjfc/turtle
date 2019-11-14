import React, { Component } from 'react'
import LargeSearch from "./LargeSearch";

class SearchModels extends Component {
    render() {
        const { placeholderText } = this.props;
        return (
            <div>
                <LargeSearch placeholderText={placeholderText}/>
            </div>
        )
    }
}

export default SearchModels