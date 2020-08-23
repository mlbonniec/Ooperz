import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import Tags from 'react-meta-tags';

class MetaTags extends Component {
    render() {
        let title;
        if(this.props.title) {
            title = (
                <>
                    <meta property="og:title" content={this.props.title} />
                    <meta name="twitter:title" content={this.props.title} />
                    <title>{this.props.title}</title>
                </>
            )
        }

        if(!this.props.children) {
            return (
                <Tags>
                    {title}
                </Tags>
            )
        }

        return ReactDOM.createPortal((
            <Tags>
                {title}
                {this.props.children}
            </Tags>
        ), document.body);
    }
}

export default MetaTags;