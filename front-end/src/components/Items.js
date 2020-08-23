import React, {Component} from 'react';
import Router from 'next/router';
import fetchAPI from '../helper/fetchAPI';
import classnames from 'classnames';

// Components
import ArticleList from './ArticleList';
import CategoriesContext from '../contexts/categories';
import Link from 'next/link';

// import Adsense from 'react-adsense';

// Styles
import '../styles/items.scss';

class Items extends Component {
    _isMounted = false;
    static contextType = CategoriesContext;

    constructor(props) {
        super(props);

        this.page = 1;
        this.state = {
            hasMore: true,
            hasError: false,
            isLoading: false,
            items: [...this.props.items]
        };

        Router.events.on('routeChangeComplete', () => {
            if(this._isMounted)
                this.setState({hasMore: true, isLoading: false, items: [...this.props.items]});
        });
    }

    componentDidMount() {
        this._isMounted = true;

        (window.adsbygoogle = window.adsbygoogle || []).push({})

        window.onscroll = () => {
            const scrollHeight = window.innerHeight + document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight;
            const {hasMore, hasError, isLoading} = this.state;

            if(!hasMore || hasError || isLoading || scrollHeight <= (windowHeight * 0.9))
                return;

            if(this._isMounted) 
                this.setState({isLoading: true}, () => this.loadMoreItems());
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    loadMoreItems() {
        fetchAPI(this.props.fetch.path, {params: {page: this.page + 1}})
            .then(result => {
                if(result.data.data.length <= 0 && this._isMounted)
                    return this.setState({hasMore: false, isLoading: false});

                this.page += 1;
                this.setState({isLoading: false, items: [...this.state.items, ...result.data.data]});
            })
            .catch(err => {
                if(this._isMounted)
                    this.setState({isLoading: false, hasError: true});
            });
    }

    render() {
        const {hasError, hasMore, isLoading} = this.state;
        const items = [...this.state.items];
        const categories = this.context;
        const highlights = items.splice(0, 3);

        return (
            <>
                <main>
                    {highlights.length !== 0 && (
                        <section id="highlights-articles" className="flex-center">
                            {highlights.map(e => (
                                <Link href="/articles/[category]/[item]" as={`/articles/${e.category}/${e.slug}`} key={e.slug}>
                                    <a>
                                        <img src={e.cover} alt={e.title} />
                                        <div className="content">
                                            <h1 className="title">{e.title}</h1>
                                            <p className="preview">{e.preview}</p>
                                        </div>
                                    </a>
                                </Link>
                            ))}
                        </section>
                    )}
                    <div id="items-container" className={classnames('wrapper', 'flex', {'no-highlights': highlights.length === 0})}>
                        <section id="articles-list" className="flex-column">
                            {items.length === 0 && (
                                <>
                                    {highlights.length !== 0 ? (
                                        <h1 className="separate-small">Aucun autres articles.</h1>
                                    ) : (
                                        <h1 className="separate-small">Aucun article pour le moment.</h1>                                        
                                    )}
                                    <h3 className="separate-high">Revenez plus tard.</h3>
                                    {/* <img src="/images/global/empty.svg" alt="Catégorie vide." id="empty-image" /> */}
                                </>
                            )}
                            {items.map((e, i) => <ArticleList item={e} key={i} />)}
                        </section>
                        <aside id="lateral-items" className="flex-column">
                            <div className="lateral-categories">
                                {categories.map((e, i) => (
                                    <Link href="/articles/[category]" as={`/articles/${e.slug}`} key={e.slug}>
                                        <a>
                                            <div className="table-data">{e.name}</div>
                                            <div className="table-data">
                                                <span>xxx</span>
                                            </div>
                                        </a>
                                    </Link>
                                ))}
                            </div>
                            <img src="/images/global/iphone-se-2020-lateral.png" alt="iPhone SE 2020" />
                            {/* À mettre à la fin de la page _document.js */}
                            {/* <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script> */}
                            {/* <Adsense.Google client="ca-pub-8193586711149513" slot="7806394673" adtest="on" /> */}
                            {/* <ins className="adsbygoogle" data-ad-slot="7806394673" data-ad-client="ca-pub-7292810486004926" data-adtest="on"></ins> */}
                        </aside>
                    </div>
                    {((!hasMore || hasError || isLoading)) && (
                        <section id="loadmore" className="wrapper" ref={this.refs.loadmore}>
                            {(!hasMore && items.length !== 0) && <h3>Vous avez atteint la fin de la liste.</h3>}
                            {hasError && <h3>Erreur lors du chargement. Veuillez réessayer.</h3>}
                            {isLoading && (
                                <div className="loader">
                                    {Array.from({length: 3}).map((e, i) => <span key={i} />)}
                                </div>
                            )}
                        </section>
                    )}
                </main>
            </>
        )
    }
}

export default Items;