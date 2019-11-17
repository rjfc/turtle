import React, { Component } from 'react'
import LargeSearch from "./LargeSearch";

class SearchModels extends Component {
    render() {
        const { placeholderText } = this.props;
        const { formAction } = this.props;
        return (
            <div>
                <LargeSearch placeholderText={placeholderText} formAction={formAction}/>
            </div>
        )
    }
}

export default SearchModels