import React, { ChangeEvent, useEffect, useState } from 'react';

import { FieldErrors } from 'react-hook-form';
import { ChangeEvent as FormChangeEvent } from '.';

type WidgetProps = {
    title: string;
    fieldName: string;
    fieldType: string;
    className?: string;
    errors?: FieldErrors<any>;
    errorText?: string;
    validateRef?: any;
    value?: string;
    description?: string;
    readOnly?: boolean;
    onChange?: FormChangeEvent;
};

export default function FormInputWidget(props: WidgetProps): JSX.Element {
    const [value, setValue] = useState<string>('');
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        setIsError(!!(props.errors && props.fieldName in props.errors));
    }, [props.errors, props.fieldName, props.validateRef]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (props.onChange) {
            props.onChange(value, event.target.value);
        }

        setValue(event.target.value);
    };

    return (
        <div
            className={
                (props.className ? props.className : '') +
                ' formBlock__widget ' +
                (isError ? '--error' : '')
            }
        >
            <label>
                <span className="fbw__title">{props.title}: </span>
                <br />
                <input
                    className="fbw__input"
                    type={props.fieldType}
                    name={props.fieldName}
                    autoComplete={props.fieldType === 'password' ? 'on' : 'off'}
                    ref={props.validateRef}
                    readOnly={props.readOnly === true}
                    value={value}
                    onChange={handleChange}
                ></input>
            </label>
            <div className="fbw__errorPlace">{isError && props.errorText}</div>
            <div className="fbw__description">{props.description}</div>
        </div>
    );
}
