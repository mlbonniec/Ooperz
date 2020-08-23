import React, {Component} from 'react';
import moment from 'moment';
import Link from 'next/link';

// Styles
import '../styles/article-list.scss';

// Misc
import 'moment/locale/fr';

class ArticleList extends Component {
    render() {
        const {cover, category, slug, title, date, preview} = this.props.item;
        const release = moment(new Date(date).toISOString()).fromNow();

        return (
            <Link href="/articles/[category]/[item]" as={`/articles/${category}/${slug}`}>
                <a className="article-list-wrapper">
                    <article className="flex">
                        <div className="image-wrapper">
                            <img src={cover} alt={title} />
                        </div>
                        <div className="content">
                            <h1 className="title">{title}</h1>
                            <p className="preview">{preview}</p>
                            {/* <p>{release}</p> */}
                        </div>
                    </article>
                </a>
            </Link>
        )
    }
}

export default ArticleList;