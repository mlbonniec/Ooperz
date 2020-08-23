import React, {Component} from 'react';
import fetchAPI from '../../helper/fetchAPI';
import Head from 'next/head';

// Component
import Items from '../../components/Items';
import ErrorPage from '../_error';

class Actus extends Component {
    static async getInitialProps({res}) {
        try {
            const items = (await fetchAPI('/v1/articles')).data.data;

            return {items, fetch: {path: '/v1/articles'}}
        } catch (e) {
            res.statusCode = e;
            return {statusCode: e};
        }
    }

    render() {
        if(this.props.statusCode)
            return <ErrorPage statusCode={this.props.statusCode} />

        return (
            <>
                <Head>
                    <meta property="og:title" content={'Actualités récentes - Ooperz'} />
                    <meta name="twitter:title" content={'Actualités récentes - Ooperz'} />
                    <title>Actualités récentes - Ooperz</title>
                </Head>
                <Items {...this.props} />
            </>
        )
    }
}

export default Actus;