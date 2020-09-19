import '../styles/default.scss';

import { FieldValidateResult, IRenderEntityProps } from '@libs/BricksTemplate';
import React, { useCallback, useState } from 'react';

import { VIEW_TYPE } from '@libs/types/IConfigTypes';

export default function SingleView(props: IRenderEntityProps): JSX.Element {
    const [values] = useState<Map<string, FieldValidateResult>>(props.defaultValue || new Map());

    const sendChangedValues = useCallback(() => {
        const result: Record<string, unknown> = {};
        let currentIsValid = true;
        for (const [key, value] of values) {
            result[key] = value.value;

            if (!value.isValid) {
                currentIsValid = false;
            }
        }

        props.onChange && props.onChange(result, currentIsValid);
    }, [props, values]);

    const onFieldChange = useCallback(
        (key: string, value: unknown, isValid: boolean) => {
            if (
                !values.has(key) ||
                values.get(key)?.value !== value ||
                values.get(key)?.isValid !== isValid
            ) {
                values.set(key, {
                    value,
                    isValid,
                });

                sendChangedValues();
            }
        },
        [values, sendChangedValues]
    );

    const view = props.isNew ? VIEW_TYPE.NEW : VIEW_TYPE.EDIT;

    const FieldsRender = props.document.fields.map((field, i) => {
        if (field.view.includes(view)) {
            const Element = props.templates.getFieldTemplate('single', field.type, field.template);

            return (
                <div key={i} className="formBlock__row">
                    <Element field={field} onChange={onFieldChange}></Element>
                </div>
            );
        }
        return null;
    });

    return <div className="singleEntity">{FieldsRender}</div>;
}
