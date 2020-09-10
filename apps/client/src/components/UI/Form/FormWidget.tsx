import React, { useEffect, useState } from 'react';

import { FieldErrors } from 'react-hook-form';

type WidgetProps = {
    title: string;
    fieldName: string;
    fieldType: string;
    className?: string;
    errors?: FieldErrors<any>;
    errorText?: string;
    validateRef: any;
};

export default function FormWidget(props: WidgetProps): JSX.Element {
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        setIsError(!!(props.errors && props.fieldName in props.errors));
    }, [props.errors, props.fieldName, props.validateRef]);

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
                ></input>
            </label>
            <div className="fbw__errorPlace">{isError && props.errorText}</div>
        </div>
    );
}
