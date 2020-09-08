import React, { Suspense } from 'react';
import { IEntity } from '@libs/types/IBricksDocument';
import BricksTemplate, { EntityChangeEvent } from '@libs/BricksTemplate';

interface IEntityMetaProps {
    document: IEntity;
    onChange?: EntityChangeEvent;
}

export default function Entity(props: IEntityMetaProps) {
    const document = props.document;

    const Template = BricksTemplate.getSingleTemplate(document.template);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Template
                document={document}
                templates={BricksTemplate}
                onChange={props.onChange}
            ></Template>
        </Suspense>
    );
}
