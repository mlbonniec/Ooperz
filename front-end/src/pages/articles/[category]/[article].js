import React, {Component, createRef} from 'react';
import fetchAPI from '../../../helper/fetchAPI';
import emoji from 'emoji-dictionary';
import moment from 'moment';
import CategoriesContext from '../../../contexts/categories';

// Components
import Zoom from 'react-medium-image-zoom'
import Markdown from 'react-markdown';
import Head from 'next/head';
import ErrorPage from '../../_error';
import Share from '../../../components/Share';

// Styles
import '../../../styles/article.scss';
import 'react-medium-image-zoom/dist/styles.css';

// Misc
import 'moment/locale/fr';

class Article extends Component {
    _isMounted = false;
    static contextType = CategoriesContext;

    constructor(props) {
        super(props);

        this.state = {
            share: false
        }

        this.markdownContent = createRef();

        this.handleClickShare = this.handleClickShare.bind(this);
        this.renderImage = this.renderImage.bind(this);
    }

    static async getInitialProps({res, query}) {
        try {
            const {category, article} = query;

            const article2 = (await fetchAPI(`/v1/articles/${category}/${article}`)).data.data;
            const redactor = (await fetchAPI(`/v1/redactors/${article2.redactor}`)).data.data;

            return {article: article2, redactor};
        } catch (e) {
            return {statusCode: res.statusCode = e};
        };
    }

    handleClickShare() {
        if(this._isMounted)
            this.setState({
                share: !this.state.share
            });
    }

    renderParagraph(props) {
        const {children} = props;
      
        if (children && children[0] && children.length === 1 && children[0].props && children[0].props.src)
            return children;
      
        return <p children={children} />
    }

    renderText(text) {
        return text.value.replace(/:\w+:/gi, name => emoji.getUnicode(name))
    }

    renderImage(image) {
        return (
            <Zoom overlayBgColorEnd="rgba(0, 0, 0, .5)" zoomMargin={80}>
                <img src={image.src} alt={image.alt} className="rounded imageMarkdown" draggable={false} />
            </Zoom>
        )
    }

    componentDidMount() {
        this._isMounted = true;

        this.ScrollReveal = require('scrollreveal').default;
        this.ScrollReveal({
            origin: 'bottom',
            duration: 1250,
            distance: '25px',
            viewFactor: 0,
            opacity: 0
        });

        this.ScrollReveal().reveal('#article-heading .title');
        this.ScrollReveal().reveal('#article-heading .intro', {delay: 75});
        this.ScrollReveal().reveal('#article-heading .date', {delay: 150});
        this.ScrollReveal().reveal('#article-heading .line-separator', {delay: 225});
        this.ScrollReveal().reveal('#article-content', {delay: 300});
    }

    componentWillUnmount() {
        this._isMounted = false;

        this.ScrollReveal().destroy();
    }

    render() {
        if(this.props.statusCode)
            return <ErrorPage statusCode={this.props.statusCode} />

        const {article: a, redactor: r} = this.props;
        const date = moment(a.date);

        return (
            <>
                <Head>
                    <meta property="og:title" content={`${a.title} - Ooperz`} />
                    <meta name="twitter:title" content={`${a.title} - Ooperz`} />
                    <title>{`${a.title} - Ooperz`}</title>
                </Head>
                <main id="main-article-container" className="wrapper">
                    <section id="article-heading" className="flex-column">
                        {/* TEMPORARY */}
                        {a.cover.startsWith("http") ? (
                            <img className="cover-image rounded separate-low placeholder" src={a.cover} alt={`Courverture de l'article - ${a.title}`} draggable={false} />
                        ) : (
                            <img className="cover-image rounded separate-low placeholder" src={`/images/articles/${a.cover}`} alt={`Courverture de l'article - ${a.title}`} draggable={false} />
                        )}
                        <h1 className="title separate-min justify-hyphens">{a.title}</h1>
                        <p className="intro">{a.preview}</p>
                        <p className="date">{date.format('[Le] dddd Do MMMM YYYY [à] hh[h]mm')}</p>
                        <span className="line-separator" />
                    </section>
                    <section id="article-content" className="flex-column" ref={this.markdownContent}>
                        <Markdown source={a.content} renderers={{paragraph: this.renderParagraph, text: this.renderText, image: this.renderImage}} />
                    </section>
                    <section id="additional" className="flex">
                        <div className="redactor flex-column">
                            <div className="desc flex-center">
                                <img src={`/images/uploads/redactors/${r.slug}.png`} className="avatar" alt={`Avatar du rédacteur ${r.name}`} />
                                <div className="name flex-column">
                                    <h4 children={r.name} />
                                    <div className="flex">
                                        <p children="Rédacteur" />
                                        {/* <a className="twitter" href={`https://twitter.com/${r.twitter}`}><i className="fab fa-twitter" /></a> */}
                                    </div>
                                </div>
                            </div>
                            <span className="separator" />
                            <p className="text justify-hyphens" children={r.bio} />
                        </div>
                        <div className="share container flex-center">
                            <div className="amount flex-column flex-center">
                                <h1>34</h1>
                                <p>partages</p>
                            </div>
                            <button className="btn rounded flex-center" onClick={this.handleClickShare}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                                    <path d="M 14.984375 1 A 1.0001 1.0001 0 0 0 14.292969 1.2929688 L 10.292969 5.2929688 A 1.0001 1.0001 0 1 0 11.707031 6.7070312 L 14 4.4140625 L 14 17 A 1.0001 1.0001 0 1 0 16 17 L 16 4.4140625 L 18.292969 6.7070312 A 1.0001 1.0001 0 1 0 19.707031 5.2929688 L 15.707031 1.2929688 A 1.0001 1.0001 0 0 0 14.984375 1 z M 9 9 C 7.3550302 9 6 10.35503 6 12 L 6 24 C 6 25.64497 7.3550302 27 9 27 L 21 27 C 22.64497 27 24 25.64497 24 24 L 24 12 C 24 10.35503 22.64497 9 21 9 L 19 9 L 19 11 L 21 11 C 21.56503 11 22 11.43497 22 12 L 22 24 C 22 24.56503 21.56503 25 21 25 L 9 25 C 8.4349698 25 8 24.56503 8 24 L 8 12 C 8 11.43497 8.4349698 11 9 11 L 11 11 L 11 9 L 9 9 z" />
                                </svg>
                                <p>Partager l'article</p>
                            </button>
                        </div>
                    </section>
                    {this.state.share && <Share toggle={this.handleClickShare} />}
                </main>
            </>
        )
    }
}

export default Article;