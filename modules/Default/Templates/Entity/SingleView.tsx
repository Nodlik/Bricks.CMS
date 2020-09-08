import React, { useState, useEffect, useRef } from 'react';
import { IRenderEntityProps } from '@libs/BricksTemplate';

import '../default.css';

export default function SingleView(props: IRenderEntityProps) {
    const values = useRef<Map<string, any>>(new Map<string, any>());

    const onFieldChange = (key: string, value: any) => {
        values.current.set(key, value);

        props.onChange && props.onChange(values.current);
    };

    const FieldsRender = props.document.fields.map((field, i) => {
        if (field.view.includes('single')) {
            values.current.set(field.key, field.value);

            const Element = props.templates.getFieldTemplate('single', field.type, field.template);
            return (
                <div key={i} className="fieldRow">
                    <Element field={field} onChange={onFieldChange}></Element>
                </div>
            );
        }
        return null;
    });

    useEffect(() => {
        if (props.onChange) props.onChange(values.current);
    }, []);

    return (
        <div>
            <div>{FieldsRender}</div>
        </div>
    );
}
