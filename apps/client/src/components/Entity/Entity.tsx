import BricksTemplate, { EntityChangeEvent, FieldValidateResult } from '@libs/BricksTemplate';

import { IEntity } from '@libs/types/IBricksDocument';
import React from 'react';

interface IEntityMetaProps {
    document: IEntity;
    isNew: boolean;
    onChange?: EntityChangeEvent;
    defaultValue?: Map<string, FieldValidateResult>;
}

export default function Entity(props: IEntityMetaProps): JSX.Element {
    const document = props.document;

    const Template = BricksTemplate.getSingleTemplate(document.template);

    return (
        <Template
            isNew={props.isNew}
            document={document}
            templates={BricksTemplate}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
        ></Template>
    );
}
