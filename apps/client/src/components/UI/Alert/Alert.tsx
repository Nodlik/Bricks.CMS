import React from 'react';

export const enum AlertState {
    ERROR = 'error',
    SUCCES = 'succes',
}

type AlertProps = {
    title?: string;
    text: string;
    state: AlertState;
};

export default function Alert(props: AlertProps): JSX.Element {
    return (
        <div className="alertBox">
            {props.text != '' && <div className={`alert --${props.state}`}>{props.text}</div>}
        </div>
    );
}
