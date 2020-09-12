import { Logo } from '../Logo';
import React from 'react';

export default function Loader(): JSX.Element {
    return (
        <div
            style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate3d(-50%, -50%, 0)',
            }}
        >
            <Logo />
        </div>
    );
}
