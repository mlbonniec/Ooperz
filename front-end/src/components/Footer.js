import React, {Component, createRef} from 'react';
// import fetch from 'isomorphic-unfetch';
import Link from 'next/link';

// Component
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faSpinner, faTimes} from '@fortawesome/free-solid-svg-icons';
import {faFacebookF, faLinkedinIn, faTelegramPlane, faTwitter} from '@fortawesome/free-brands-svg-icons';

// Styles
import '../styles/footer.scss';

class Footer extends Component {
    _isMounted = false;
    _newsletterDefault = <p>S'abonner</p>

    constructor(props) {
        super(props);

        this.state = {
            newsletterStatus: this._newsletterDefault
        }

        this.newsletterSubscriptionInput = createRef();
        this.newsletterSubscription = this.newsletterSubscription.bind(this);
    }
    
    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async newsletterSubscription() {
        if(this.state.newsletterStatus !== this._newsletterDefault)
            return;

        if(!(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.newsletterSubscriptionInput.current.value)) && this._isMounted) {
            this.newsletterSubscriptionInput.current.parentElement.style.boxShadow = "0px 0px 2px 2px rgba(204, 0, 0, 0.75)";
            return setTimeout(() => this.newsletterSubscriptionInput.current.parentElement.style.boxShadow = null, 1000);
        }

        if(this._isMounted)
            this.setState({
                newsletterStatus: <FontAwesomeIcon icon={faSpinner} spin={true} />
            });

        // fetch('https://api.ooperz.fr/v1/actus/recent')
        //     .then(res => {
        //         if(res.ok)
        //             return res.json();

        //         throw new Error(res.status);
        //     })
        //     .then(_ => {
        //         if(this._isMounted) {
        //             this.newsletterSubscriptionInput.current.parentElement.setAttribute('disabled', true);
        //             this.newsletterSubscriptionInput.current.setAttribute('readonly', true);
        //             this.setState({
        //                 newsletterStatus: <FontAwesomeIcon icon={faCheck} />
        //             })
        //         }
        //     })
        //     .catch(err => {
        //         console.log(this._isMounted)
        //         if(this._isMounted)
        //             this.setState({
        //                 newsletterStatus: <FontAwesomeIcon icon={faTimes} />
        //             })
        //         console.error(`Error: received ${err.message} status code while fetching newsletter API.`);
        //     });
    }

    render() {
        return (
            <footer id="footer" className="wrapper flex">
                <div className="footer-section-container website-copy-container flex-column">
                    <img src="/images/global/logos/white.svg" alt="Ooperz Logo" />
                    <ul className="flex-center social-networks-container">
                        <li>
                            <a href="https://facebook.com">
                                <FontAwesomeIcon icon={faFacebookF} />
                            </a>
                        </li>
                        <li>
                            <a href="https://twitter.com">
                                <FontAwesomeIcon icon={faTwitter} />
                            </a>
                        </li>
                        <li>
                            <a href="https://linkedin.com">
                                <FontAwesomeIcon icon={faLinkedinIn} />
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="footer-section-container website-content-container">
                    <h3>Explorer</h3>
                    <ul>
                        <li>
                            <Link href="/">
                                <a>Accueil</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/actualites">
                                <a>Actualités</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/tests">
                                <a>Tests</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/recherche">
                                <a>Rechercher</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/a-propos">
                                <a>À propos</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/plan-du-site">
                                <a>Plan du site</a>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="footer-section-container website-informations-container">
                    <h3>Informations</h3>
                    <ul>
                        <li>
                            <Link href="/qui-sommes-nous">
                                <a>Qui sommes-nous ?</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact">
                                <a>Contactez-nous</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/confidentialité">
                                <a>Politique de confidentialité</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/mentions-legalges">
                                <a>Mentions légales</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/conditions-generales-utilisation">
                                <a>Conditions générales d'utilisation</a>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="footer-section-container website-newsletter-container flex-column">
                    <h3>newsletter</h3>
                    <div className="newsletter-box-container flex-center rounded">
                        <input type="email" name="newsletter-email" id="newsletter-email" placeholder="Entrez votre adresse email" ref={this.newsletterSubscriptionInput} />
                        <button type="submit" onClick={this.newsletterSubscription}>
                            {this.state.newsletterStatus}
                        </button>
                    </div>
                    <p>En vous abonnant à notre newsletter, vous serez assuré d'être au courant de l'actualité High-Tech. Chaque semaine, recevez un mail vous récapitulant les principales actualités High-Tech.</p>
                </div>
            </footer>
       )
    }
}

export default Footer;