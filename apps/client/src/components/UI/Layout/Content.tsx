import React from 'react';

type ContentProps = {
    children?: React.ReactNode;
};

export default function Content(props: ContentProps): JSX.Element {
    return <main className="content">{props.children}</main>;
}
