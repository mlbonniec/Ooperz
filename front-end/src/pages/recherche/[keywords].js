import React, {Component} from 'react';

class Keywords extends Component {
    static async getInitialProps({query, req}) {
        const {keywords} = query;

        return {keywords}
    }

    render() {
        return (
            <p>{this.props.keywords}</p>
        )
    }
}

export default Keywords;