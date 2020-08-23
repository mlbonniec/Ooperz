import React, {Component} from 'react';
import moment from 'moment';
import fetchAPI from '../helper/fetchAPI';
import CategoriesContext from '../contexts/categories';

// Components
import Link from 'next/link';
import Card from '../components/Card';
import Flickity from '../components/Flickity';
import ErrorPage from './_error';

// Styles
import '../styles/index.scss';

// Misc
import 'moment/locale/fr';

class Index extends Component {
    _isMounted = false;
    static contextType = CategoriesContext;

    constructor(props) {
        super(props);

        this.state = {
            day: props.day,
            time: props.time
        }
    }

    static async getInitialProps({res}) {
        try {
            const time = moment().format('HH:mm');
            const day = moment().format('dddd Do MMMM');

            const sort = {recent: {by: 'date', order: 'desc'}, popular: {by: 'views', order: 'desc'}};
            const requests = [];
            
            for (const e of Object.keys(sort))
                requests.push(fetchAPI('/v1/articles', {params: {by: sort[e].by, order: sort[e].order}}))

            const data = (await Promise.all(requests)).map(e => e.data.data);

            return {time, day, recent: data[0], popular: data[1]};
        } catch (e) {
            res.statusCode = e;
            return {statusCode: e};
        }
    }

    refreshTimeDay() {
		if(moment().format('HH:mm') !== this.state.time && this._isMounted)
			this.setState({time: moment().format('HH:mm')});
		if(moment().format('dddd Do MMMM') !== this.state.day && this._isMounted)
			this.setState({day: moment().format('dddd Do MMMM')});
    }
    
    componentDidMount() {
        this._isMounted = true;
        this.updateTime = setInterval(() => this.refreshTimeDay(), 1000);
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(this.updateTime);
    }

    render() {
        if(this.props.statusCode)
            return <ErrorPage statusCode={this.props.statusCode} />

        const categories = this.context;

        return (
            <>
                <main>
                    <section id="home" className="wrapper flex-center separate-break">
						<div className="calendar">
							<h4 className="today">{this.state.day}</h4>
							<h1 className="time">{this.state.time}</h1>
						</div>
						<Flickity className="slider items recent-news" options={{autoPlay: true}}>
                            {this.props.recent.map(e => (
                                <Card key={e.slug} item={e} />
                            ))}
                        </Flickity>
					</section>
                    <div id="sections-wrapper" className="wrapper">
						<section id="popular" className="separate-high">
							<header className="flex-center separate-high">
								<h2 className="title">Les plus vus</h2>
								<nav className="categories">
									<Flickity elementType="ul" className="slider content">
                                        {categories.map(e => (
                                            <li key={e.slug} className="carousel-cell">
                                                <Link href="/articles/[category]" as={`/articles/${e.slug}`}>
                                                    <a>{e.name}</a>
                                                </Link>
                                            </li>
                                        ))}
                                    </Flickity>
								</nav>
							</header>
							<Flickity className="slider items categories-news rounded">
                                {this.props.popular.map(e => (
                                    <Card key={e.slug} item={e} />
                                ))}
                            </Flickity>
						</section>
						{/* <section id="pinned">
							<header>
								<h2 className="title separate-medium">Articles épinglés</h2>
							</header>
							<div className="flex"></div>
						</section> */}
					</div>
                </main>
            </>
        );
    }
}

export default Index;