import {Component, createElement} from 'react';
import {createPortal} from 'react-dom';
import imagesloaded from 'imagesloaded';

class Slider extends Component {
	_isMounted = false;
	
  	constructor(props) {
		super(props);

    	this.state = {
			flickityReady: false
    	};
	}

  	componentDidMount() {
		this._isMounted = true;

		const Flickity = require('flickity');
		const preventVerticalScroll = () => document.querySelector('html').classList.toggle('is-sliding');

		const defaultOptions = {
			arrowShape: {x0: 20, x1: 70, y1: 40, x2: 70, y2: 0, x3: 70},
			pageDots: false,
			contain: true,
			cellAlign: 'left',
			freeScroll: false,
			accessibility: false
		}

		this.flkty = new Flickity(this.flickityNode, {...defaultOptions, ...this.props.options} || {});
        this.flkty.on('dragStart', preventVerticalScroll);
        this.flkty.on('dragEnd', preventVerticalScroll);

		this.setReady();
	}

  	componentWillUnmount() {
		this._isMounted = false;

		this.flkty.stopPlayer();
  	}

  	componentDidUpdate(prevProps, prevState) {
		const {children} = this.props;
		const {flickityReady} = this.state;

		if (!prevState.flickityReady && flickityReady) {
		  	this.flkty.deactivate();
		  	this.flkty.selectedIndex = 0;
		  	this.flkty.options.draggable = children ? children.length > 1 : false
		  	this.flkty.activate();
		} else
	  		this.flkty.reloadCells();
	}

	setReady() {
		if(this._isMounted)
			imagesloaded(this.flickityNode, this.setState({flickityReady: true}));
	}

  	renderPortal() {
    	if (!this.flickityNode)
			return null;

    	const mountNode = this.flickityNode.querySelector('.flickity-slider');

    	if (mountNode) {
			const element = createPortal(this.props.children, mountNode);
			setTimeout(() => this.setReady(), 0);
			return element;
		}
	}

  	render() {
		return createElement(
			this.props.elementType ? this.props.elementType : 'div',
			{
				className: this.props.className,
				id: this.props.id,
				style: this.props.style,
				key: 'flktyNode',
			  	ref: node => this.flickityNode = node,
			},
			this.renderPortal()
		);
  	}
}

export default Slider;