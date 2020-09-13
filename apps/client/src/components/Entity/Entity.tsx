import BricksTemplate, { EntityChangeEvent } from '@libs/BricksTemplate';
import React, { Suspense } from 'react';

import { IEntity } from '@libs/types/IBricksDocument';

interface IEntityMetaProps {
    document: IEntity;
    isNew: boolean;
    onChange?: EntityChangeEvent;
}

export default function Entity(props: IEntityMetaProps): JSX.Element {
    const document = props.document;

    const Template = BricksTemplate.getSingleTemplate(document.template);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Template
                isNew={props.isNew}
                document={document}
                templates={BricksTemplate}
                onChange={props.onChange}
            ></Template>
        </Suspense>
    );
}
