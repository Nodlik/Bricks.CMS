import React, { ReactNode } from 'react';

type BreadcrumbItemProps = {
    children?: ReactNode;
    isCurrent?: boolean;
};

type BreadcrumbProps = {
    children?: ReactNode;
};

export function BreadcrumbItem(props: BreadcrumbItemProps): JSX.Element {
    return (
        <li className={'breadcrumb__item' + (props.isCurrent ? ' --current' : '')}>
            {props.children}
        </li>
    );
}

export default function Breadcrumb(props: BreadcrumbProps): JSX.Element {
    return <ul className="breadcrumb">{props.children}</ul>;
}
