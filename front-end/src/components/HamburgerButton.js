import React, {Component} from 'react';

import '../styles/hamburger.scss';

class HamburgerButton extends Component {
    render() {
        return (
            <div id="hamburger-button" {...this.props}>
                <div className="hamburger-box">
                    <div className="hamburger-inner" />
                </div>
            </div>    
        )
    }
}

export default HamburgerButton;