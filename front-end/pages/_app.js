import App from 'next/app';
import React from 'react';
import fetchAPI from '../helper/fetchAPI';

// Context
import {CategoriesProvider} from '../contexts/categories';

// Components
import ErrorPage from './_error';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Styles
import '../styles/reset.scss';
import '../styles/global.scss';
import 'flickity/css/flickity.css';
import '@fortawesome/fontawesome-svg-core/styles.css'

// Misc
import {config} from '@fortawesome/fontawesome-svg-core'
import nookies from 'nookies';
config.autoAddCss = false

class MyApp extends App {
    static async getInitialProps({Component, ctx}) {
        try {
            let pageProps = {}

            if(Component.getInitialProps)
                pageProps = await Component.getInitialProps(ctx);

            const categories = (await fetchAPI('/v1/categories')).data.data;

            return {categories, pageProps};
        } catch (e) {
            ctx.res.statusCode = e;
            return {statusCode: e};
        }
    }

    componentDidMount() {
        const darkThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const {body} = document;

        darkThemeMediaQuery.addListener(e => {
            const isDarkTheme = e.matches;
            isDarkTheme
                ? body.setAttribute('dark-theme', true)
                : body.removeAttribute('dark-theme');
        });

        document.addEventListener('keydown', e => {
            if(e.target instanceof HTMLInputElement)
                return;

            switch (e.which) {
                case 68:
                    const isDarkTheme = darkThemeMediaQuery.matches;
                
                    if(body.hasAttribute('dark-theme')) { // Ici on enlève le dark theme
                        if(isDarkTheme) // Si il est activé par défaut, on force le light theme
                            nookies.set({}, 'theme', 'light', {
                                maxAge: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                            });
                        else // Si il n'est pas activé par défaut, on supprime le forçage
                            nookies.destroy({}, 'theme');

                        body.removeAttribute('dark-theme');
                    } else { // Ici on met le dark theme
                        if(isDarkTheme) // Si il est activé par défaut, on supprime le forçage
                            nookies.destroy({}, 'theme');
                        else // Sinon on force le dark theme
                            nookies.set({}, 'theme', 'dark', {
                                maxAge: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                            });

                        body.setAttribute('dark-theme', true);
                    }
                    break;
                case 70:
                    if(!document.fullscreenElement)
                        document.documentElement.requestFullscreen();
                    else if(document.exitFullscreen)
                        document.exitFullscreen(); 
                    break;
            }
        })
    }

    render() {
        const {Component, pageProps, categories, statusCode} = this.props;

        if(statusCode)
            return <ErrorPage statusCode={statusCode} />
    
        return (
            <CategoriesProvider value={categories}>
                <Header />
                <Component {...pageProps} />
            </CategoriesProvider>
        )
    }
}

export default MyApp;