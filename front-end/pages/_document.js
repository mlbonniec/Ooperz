import Document, {Html, Head, Main, NextScript} from 'next/document';
import {ServerStyleSheet} from 'styled-components';
import nookies from 'nookies'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const {renderPage} = ctx;
        const cookies = nookies.get(ctx);

        const sheet = new ServerStyleSheet();
        const page = renderPage((App) => (props) => sheet.collectStyles(<App {...props} />));
        const styleTags = sheet.getStyleElement();

        const initialProps = await Document.getInitialProps(ctx);
    
        return {
            ...page,
            ...initialProps,
            styleTags,
            theme: cookies.theme ? cookies.theme : undefined
        };
    }

    render() {
        const darkTheme = this.props.theme ? this.props.theme === 'dark' ? {"dark-theme": "true"} : null : null

        return (
            <Html lang="fr-FR">
                <Head>
                    <meta name="description" content="Ooperz - Site Français d'actualités High-Tech" />
                    <meta property="og:description" content="Ooperz - Site Français d'actualités High-Tech" />
                    <meta name="twitter:description" content="Ooperz - Site Français d'actualités High-Tech" />

                    <meta name="msapplication-config" content="/images/favicons/browserconfig.xml" />
                    <meta name="msapplication-navbutton-color" content="#111d4a" />
                    <meta name="msapplication-TileColor" content="#111d4a" />
                    <meta name="theme-color" content="#111d4a" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="#111d4a" />

                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://www.ooperz.fr" />
                    <meta property="og:image" content="/images/global/preview.png" />

                    <meta property="og:site_name" content="Ooperz" />
                    <meta property="og:keywords" content="actualités, informations, technologies, high-tech" />
                    <meta property="og:locale" content="fr" />

                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content="@ooperzfr" />
                    <meta property="twitter:image" content="https://mathislebonniec.fr/images/global/preview.png" />
                    {this.props.styleTags}
                </Head>
                <body className="flex-column" {...darkTheme}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
  
export default MyDocument;