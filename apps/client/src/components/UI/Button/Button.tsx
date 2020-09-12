import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import React from 'react';

export const enum ButtonState {
    ACTIVE = 'active',
    DISABLED = 'disabled',
    PENDING = 'pending',
}

type ButtonProps = {
    title: string;
    type?: 'button' | 'submit' | 'reset' | undefined;
    state?: ButtonState;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function Button(props: ButtonProps): JSX.Element {
    return (
        <button
            onClick={props.onClick}
            type={props.type || 'button'}
            disabled={props.state === ButtonState.DISABLED || props.state === ButtonState.PENDING}
            className={'button ' + (props.state === ButtonState.PENDING ? '--pending' : '')}
        >
            {props.state === ButtonState.PENDING && <AiOutlineLoading3Quarters />}
            {props.title}
        </button>
    );
}
