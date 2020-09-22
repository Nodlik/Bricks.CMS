import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { IconType } from 'react-icons/lib';
import React from 'react';

export const enum ButtonState {
    ACTIVE = 'active',
    DISABLED = 'disabled',
    PENDING = 'pending',
}

export const enum ButtonType {
    PRIMARY = 'primary',
    DANGER = 'danger',
}

type ButtonProps = {
    title: string;
    type?: 'button' | 'submit' | 'reset' | undefined;
    state?: ButtonState;
    icon?: IconType;
    buttonType?: ButtonType;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function Button(props: ButtonProps): JSX.Element {
    const Icon = props.icon;

    return (
        <button
            onClick={props.onClick}
            type={props.type || 'button'}
            disabled={props.state === ButtonState.DISABLED || props.state === ButtonState.PENDING}
            className={
                (props.className ? props.className : '') +
                ' button ' +
                (props.state === ButtonState.PENDING ? '--pending ' : ' ') +
                (props.buttonType ? `--${props.buttonType}` : '--primary')
            }
        >
            {props.state === ButtonState.PENDING && <AiOutlineLoading3Quarters />}
            {Icon && <Icon style={{ fontSize: '150%' }} />}
            {props.title}
        </button>
    );
}
