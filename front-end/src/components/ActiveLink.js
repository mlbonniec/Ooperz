import {withRouter} from 'next/router';
import Link from 'next/link';
import React, {Children} from 'react';

const ActiveLink = ({router, children, ...props}) => {
    const child = Children.only(children);

    let className = child.props.className || '';
    if(router.asPath === props.href || (router.asPath.startsWith(props.href) && props.href !== '/'))
        className = `${className} active`.trim();

    return (
        <Link {...props}>
            {React.cloneElement(child, {className})}
        </Link>
    );
};

export default withRouter(ActiveLink);