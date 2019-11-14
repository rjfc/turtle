import React, { Component } from 'react'

class LargeSearch extends Component {
    render() {
        const { placeholderText } = this.props;
        return (
            <div className="Large-search-container">
                <input className="Large-search-submit" type="submit" value="GO"/>
                <div className="Large-search-input-wrapper">
                    <input className="Large-search" type="text" placeholder={placeholderText}/>
                </div>
            </div>
        )
    }
}

export default LargeSearch