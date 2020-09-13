import '../styles/default.scss';

import React, { useEffect, useRef } from 'react';

import { IRenderEntityProps } from '@libs/BricksTemplate';
import { VIEW_TYPE } from '@libs/types/IConfigTypes';

export default function SingleView(props: IRenderEntityProps): JSX.Element {
    const onChange = props.onChange;
    const values = useRef<Map<string, any>>(new Map<string, any>());

    const onFieldChange = (key: string, value: any) => {
        values.current.set(key, value);

        props.onChange && props.onChange(values.current);
    };

    const view = props.isNew ? VIEW_TYPE.NEW : VIEW_TYPE.EDIT;

    const FieldsRender = props.document.fields.map((field, i) => {
        if (field.view.includes(view)) {
            values.current.set(field.key, field.value);

            const Element = props.templates.getFieldTemplate('single', field.type, field.template);
            return (
                <div key={i} className="formBlock__row">
                    <Element field={field} onChange={onFieldChange}></Element>
                </div>
            );
        }
        return null;
    });

    useEffect(() => {
        if (onChange) {
            onChange(values.current);
        }
    }, [onChange]);

    return <div className="singleEntity">{FieldsRender}</div>;
}
