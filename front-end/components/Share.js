import React, {Component, createRef} from 'react';

// Components
import Modal from './Modal';
import Flickity from './Flickity';

// Styles
import '../styles/share.scss';

class Share extends Component {
    _isMounted = false;
    _isCopied = false;
    
    constructor(props) {
        super(props);

        this.state = {
            url: '',
            title: ''
        }

        this.url = createRef();

        this.copyToClipboard = this.copyToClipboard.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;

        if(this._isMounted)
            this.setState({
                title: document.querySelector('title').innerHTML,
                url: window.location.href
            })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    copyToClipboard() {
        const text = this.url.current;
        const {value} = text;

        if(this._isCopied)
            return;

        text.select();
        text.setSelectionRange(0, 99999);

        document.execCommand('copy');

        this._isCopied = true;
        
        text.value = "Lien copié dans le presse papier !";
        setTimeout(() => {
            text.value = value
            this._isCopied = false;
        }, 2000);
    }

    render() {
        const url = encodeURIComponent(this.state.url);
        const title = encodeURIComponent(this.state.title);
        const body = encodeURIComponent(`${this.state.title}\nVoici un article très intéressant sur Ooperz. Il est disponible à cette adresse: ${this.state.url}`);

        return (
            <Modal toggle={this.props.toggle} className="share">
                <div id="share" className="flex-center flex-column rounded">
                    <h1 className="separate-medium">Partager</h1>
                    <Flickity options={{groupCells: true, cellAlign: 'center'}} className="social-networks separate-low">
                        <a href={`https://twitter.com/intent/tweet?text=${body}`} target="_blank" className="btn flex twitter"><i className="fab fa-twitter" /></a>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${body}`} target="_blank" className="btn flex facebook"><i className="fab fa-facebook-f" /></a>
                        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`} target="_blank" className="btn flex linkedin"><i className="fab fa-linkedin-in" /></a>
                        <a href={`https://telegram.me/share/url?url=${url}&text=${body}`} target="_blank" className="btn flex telegram"><i className="fab fa-telegram-plane" /></a>
                        <a href={`https://www.tumblr.com/widgets/share/tool?shareSource=legacy&canonicalUrl=${url}&posttype=link`} target="_blank" className="btn flex tumblr"><i className="fab fa-tumblr" /></a>
                        <a href={`sms:0102030405&body=${body}`} target="_self" className="btn flex sms"><i className="fas fa-comment" /></a>
                        <a href={`mailto:?subject=${title}&body=${body}`} target="_self" className="btn flex mail"><i className="fas fa-at" /></a>
                    </Flickity>
                    <div className="url flex">
                        <input type="text" ref={this.url} size={1} readOnly value={this.state.url} />
                        <button onClick={this.copyToClipboard}>Copier</button>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default Share;