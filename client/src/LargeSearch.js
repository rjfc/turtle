import React, { Component } from 'react'

class LargeSearch extends Component {
    render() {
        const { placeholderText } = this.props;
        return (
            <div>
                <input className="Large-search" type="text" placeholder={placeholderText}/>
            </div>
        )
    }
}

export default LargeSearch