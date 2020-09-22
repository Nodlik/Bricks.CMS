import { IBricksDocument, IEntity } from '@libs/types/IBricksDocument';

import React from 'react';
import { Redirect } from 'react-router-dom';
import { useFetchRequest } from '@client/hooks/fetch';

interface IEntityMetaProps {
    entity: IEntity;
}

export default function SingleEntity(props: IEntityMetaProps): JSX.Element | null {
    const document = useFetchRequest<IBricksDocument | null>(`/entities/${props.entity.key}/first`);

    if (document === null) {
        return <Redirect to={`/entity/key/${props.entity.key}/new`} />;
    } else if (!document) {
        return null;
    }

    return <Redirect to={`/entity/key/${props.entity.key}/id/${document.id}`} />;
}
