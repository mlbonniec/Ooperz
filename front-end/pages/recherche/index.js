import React, {Component} from 'react';
import fetchAPI from '../../helper/fetchAPI';

// Components
import Card from '../../components/Card';

// Styles
import '../../styles/search.scss';

class Search extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            value: null,
            items: [],
            error: false
        }

        this.handleSearchInput = this.handleSearchInput.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async componentDidUpdate(prevProps, prevState) {
        const {value} = this.state;

        if(prevState.value !== value) {
            if(this.isNullOrWhiteSpace(value) && this._isMounted)
                return this.setState({
                    items: [],
                    value: null
                });

            try {
                const res = await fetchAPI(`/v1/search/${value}`);

                if(this._isMounted)
                    this.setState({
                        items: res.items
                    });
            } catch(err) {
                if(this._isMounted)
                    this.setState({
                        error: true,
                        value: null,
                        items: []
                    });
            }
        }
    }
    
    handleSearchInput(e) {
        this.setState({
            value: e.target.value.toLowerCase()
        });
    }

    isNullOrWhiteSpace(str) {
        return (!str || str.length === 0 || /^\s*$/.test(str))
    }

    render() {
        const {value, items, error} = this.state;
        
        return (
            <main id="main-search-container" className="flex-column">
                <section id="search" className="wrapper separate-low">
                    <h1 className="separate-min">Rechercher un article</h1>
                    <input type="text" name="search" placeholder="ex, Test du Galaxy Fold..." autoComplete="off" onChange={this.handleSearchInput} />
                </section>
                <section id="search-results" className="wrapper">
                    {this.isNullOrWhiteSpace(value) && <h1>Rechercher un article</h1>}
                    {!this.isNullOrWhiteSpace(value) && items.length === 0 && <h1>Aucun article correspondant à {value}</h1>}
                    {!this.isNullOrWhiteSpace(value) && items.length > 0 && <h1 className="separate-min">Articles correspondant à {value}</h1>}
                    {items.length > 0 && (
                        <div className="card-item-container">
                            {items.map(e => <Card key={e.item.id} element={e} />)}
                        </div>
                    )}
                </section>
            </main>
        )
    }
}

export default Search;