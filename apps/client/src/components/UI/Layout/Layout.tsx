import React from 'react';

type LayoutProps = {
    children?: React.ReactNode;
};

export default function Layout(props: LayoutProps): JSX.Element {
    return <section className="layout">{props.children}</section>;
}
