import React from 'react';

type MenuElementProps = {
    children?: React.ReactNode;
};

export default function MenuItem(props: MenuElementProps): JSX.Element {
    return <li className="menu__item">{props.children}</li>;
}
