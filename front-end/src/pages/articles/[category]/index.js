import React, {Component} from 'react';
import fetchAPI from '../../../helper/fetchAPI';
import Head from 'next/head';

// Components
import Items from '../../../components/Items';
import ErrorPage from '../../_error';

class Actus extends Component {
    static async getInitialProps({query, res}) {
        try {
            const items = (await fetchAPI(`/v1/articles/${query.category}`)).data.data;
            // const category = data[1].find(e => e.slug === query.category);

            return {items, fetch: {path: '/v1/articles/' + query.category}}
        } catch (e) {
            res.statusCode = e;
            return {statusCode: e};
        }
    }

    render() {
        if(this.props.statusCode)
            return <ErrorPage statusCode={this.props.statusCode} />

        const name = "À METTRE";

        return (
            <>
                <Head>
                    <meta property="og:title" content={`Actualités ${name} - Ooperz`} />
                    <meta name="twitter:title" content={`Actualités ${name} - Ooperz`} />
                    <title children={`Actualités ${name} - Ooperz`} />
                </Head>
                <Items {...this.props} />
            </>
        )
    }
}

export default Actus;