import React, {Component} from 'react';
import moment from 'moment';
import Link from 'next/link';

// Styles
import '../styles/card.scss';

// Misc
import 'moment/locale/fr';

class Card extends Component {
    render() {
        const {cover, category, slug, title, date} = this.props.item;
        const release = moment(new Date(date).toISOString()).fromNow();

        const placeholders = [
            "https://img.phonandroid.com/2020/02/galaxy-z-flip-officiel.jpg",
            "https://images.frandroid.com/wp-content/uploads/2020/02/huawei-p30-amazon-baisse-de-prix-1200x777.jpg",
            "https://images.frandroid.com/wp-content/uploads/2020/01/essai-renault-zoe-2019-1200x675.jpg",
            "https://images.frandroid.com/wp-content/uploads/2018/07/tv-1000x619.jpg",
            "https://images.frandroid.com/wp-content/uploads/2020/02/guide-dachat-2020-des-nas-1200x675.jpg",
            "https://images.frandroid.com/wp-content/uploads/2019/10/cloud-gaming-frandroid-dsc03736-1200x800.jpg",
            "https://images.frandroid.com/wp-content/uploads/2020/02/p9230159-copie.jpg"
        ]
        const image = cover === "image-demo.png"
            ? `url(${placeholders[Math.floor(Math.random() * placeholders.length)]})`
            // : `url(/images/uploads/items/${slug}/${cover})`
            : `url(${cover})`

        return (
            <Link href="/articles/[category]/[item]" as={`/articles/${category}/${slug}`}>
                {/* <a className={`card flex-column ${this.props.className ? this.props.className : ''}`} style={{backgroundImage: `url(/images/uploads/items/${id}/${cover})`}}> */}
                <a className="card flex-column" style={{backgroundImage: image}}>
                    <h4 className="title">{title}</h4>
                    <span className="release">{release}</span>
                </a>
            </Link>
        )
    }
}

export default Card;