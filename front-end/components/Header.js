import React, {Component, createRef, forwardRef} from 'react';
import CategoriesContext from '../contexts/categories';

// Components
import Tippy from '@tippyjs/react';
import Link from 'next/link';
import ActiveLink from './ActiveLink';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch, faInfoCircle, faRss, faHome} from '@fortawesome/free-solid-svg-icons';

// Styles
import '../styles/header.scss';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';
import 'tippy.js/animations/shift-toward.css';

// Components
import HamburgerButton from './HamburgerButton';

class Header extends Component {
    _isMounted = false;
    static contextType = CategoriesContext;

	constructor() {
		super();

		this.state = {
			isMenuToggled: false
        }
        
        this.overlay = createRef();
        this.container = createRef();

        this.toggleMenu = this.toggleMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this)
    }
    
	componentDidMount() {
        this._isMounted = true;
        
        const overlay = this.overlay.current;

        overlay.addEventListener('transitionend', () => {
            if(!overlay.classList.contains('animate'))
                overlay.classList.toggle('visible');
        });
    }
    
    componentWillUnmount() {
        this._isMounted = false;
    }

	componentDidUpdate(prevProps, prevState) {
        if(this.state.isMenuToggled === prevState.isMenuToggled)
            return;
        
        const container = this.container.current;
        const overlay = this.overlay.current;

		document.querySelector('.toggle').classList.toggle('is-active');
        container.classList.toggle('visible');

        if(overlay.classList.contains('animate'))
            overlay.classList.toggle('animate');
        else {
            overlay.classList.toggle('visible');
            overlay.classList.toggle('animate');
        }
	}

    toggleMenu() {
        if(this._isMounted)
            this.setState({isMenuToggled: !this.state.isMenuToggled})
    }

    closeMenu() {
        if(this.state.isMenuToggled && this._isMounted)
            this.setState({isMenuToggled: false});
    }
    
    fixTippyRef = forwardRef((props, ref) => (
        <ActiveLink href="/articles">
            <a onClick={this.closeMenu} data-articles-menu="true" ref={ref}>
                <FontAwesomeIcon icon={faRss} />Articles
            </a>
        </ActiveLink>   
    ));
    
    navElement() {
        return (
            <nav className="menu">
                <ul className="flex-center">
                    <li>
                        <ActiveLink href="/">
                            <a onClick={this.closeMenu}>
                                <FontAwesomeIcon icon={faHome} />Accueil
                            </a>
                        </ActiveLink>
                    </li>
                    <li>
                        <Tippy content={this.renderTippy()} interactive={true} animation="shift-toward" offset={[0, 15]} maxWidth={null} theme="light-border">
                            <this.fixTippyRef />
                        </Tippy>
                    </li>
                    <li>
                        <ActiveLink href="/a-propos">
                            <a onClick={this.closeMenu}>
                                <FontAwesomeIcon icon={faInfoCircle} />À propos
                            </a>
                        </ActiveLink>
                    </li>
                    <li>
                        <Link href="/recherche">
                            <a onClick={this.closeMenu} id="search-icon-header">
                                <FontAwesomeIcon icon={faSearch} />
                            </a>
                        </Link>
                    </li>
                </ul>
            </nav>
        )
    }

    renderTippy() {
        const categories = this.context;
        const rowPerColumn = 5;

        return (
            <table>
                <thead>
                    <tr>
                        <th>Catégories</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({length: rowPerColumn}).map((_, i1) => (
                        <tr key={i1}>
                            {Array.from({length: Math.ceil(categories.length/rowPerColumn)}).map((_, i2) => i1+i2*rowPerColumn >= categories.length ? null : (
                                <td key={i2}>
                                    <Link href="/articles/[category]" as={'/articles/' + categories[i1+i2*rowPerColumn].slug}>
                                        <a className="header-categories-link">
                                            {categories[i1+i2*rowPerColumn].name}
                                        </a>
                                    </Link>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }

    render() {
        return (
            <header id="headers" className="flex">
                <div id="desktop" className="flex wrapper">
                    <Link href="/">
                        <a className="flex-center">
                            <span className="logo" />
                        </a>
                    </Link>
                    {this.navElement()}
                    <HamburgerButton className="toggle" onClick={this.toggleMenu} />
                </div>
                <div id="mobile" className="flex-center">
                    <div className="overlay" ref={this.overlay} onClick={this.toggleMenu}></div>
                    <div className="wrapper flex-column" ref={this.container}>
                        <div className="separate-high">
                            <Link href="/">
                                <a className="flex-center">
                                    <span className="logo" />
                                </a>
                            </Link>
                        </div>
                        {this.navElement()}
                        <div className="menu-footer">
                            <p>Ooperz - Actualités High-Tech</p>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;