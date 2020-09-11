import React from 'react';

type MenuProps = {
    children?: React.ReactNode;
};

export default function Menu(props: MenuProps): JSX.Element {
    return <ul className="menu">{props.children}</ul>;
}
