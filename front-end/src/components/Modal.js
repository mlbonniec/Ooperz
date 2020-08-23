import React, {Component, createRef} from 'react';

// Styles
import '../styles/modal.scss';

class Modal extends Component {
    constructor(props) {
        super(props);
        
        this.modal = createRef();
        this.content = createRef();

        this.closeModal = this.closeModal.bind(this);
        this.handleEscape = this.handleEscape.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', e => this.handleEscape(e))
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', e => this.handleEscape(e))
    }

    handleEscape(e) {
        const modal = this.content.current;
        if(e.keyCode !== 27 || !modal || modal.classList.contains('background-out'))
            return;
        
        this.closeModal();
    }

    closeModal() {
        this.modal.current.classList.add('background-out');
        this.content.current.classList.add('popup-out');
    }

    render() {
        return (
            <section id="modal" className={`flex-center ${this.props.className}`} ref={this.modal} onClick={e => e.target !== e.currentTarget ? null : this.closeModal()}
                onAnimationEnd={e => {
                    const el = e.currentTarget;
                    if(!el.classList.contains('background-out'))
                        return;

                    el.classList.remove('background-out');
                    this.props.toggle();
                }}>
                <div className="content" ref={this.content}>
                    <i className="close flex-center fas fa-times" onClick={this.closeModal} />
                    {this.props.children}
                </div>
            </section>
        )
    }
}

export default Modal;